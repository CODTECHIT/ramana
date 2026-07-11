import { Request, Response } from "express";
import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { z } from "zod";
import { sendOrderInvoiceEmail, sendTrackingUpdateEmail } from "../utils/mail.js";
import { processPaymentSuccess } from "../services/paymentService.js";

dotenv.config();

if (!process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("RAZORPAY_KEY_SECRET is not defined in environment variables");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mockkey",
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req: Request, res: Response) => {
  const idempotencyKey = req.headers["idempotency-key"] as string | undefined;

  if (idempotencyKey) {
    const existingOrder = await Order.findOne({ idempotencyKey });
    if (existingOrder) {
      // Idempotency hit: return existing order
      return res.status(200).json(existingOrder);
    }
  }

  const session = await mongoose.startSession();
  try {
    const { items, shippingAddress, paymentMethod, guestInfo } = req.body;

    const itemSchema = z.object({
      productId: z.string().optional(),
      id: z.string().optional(),
      qty: z.number().int().positive().min(1),
      variant: z.string().optional(),
      name: z.string().optional()
    }).refine(data => data.productId || data.id, {
      message: "Item must have either productId or id"
    });

    const addressSchema = z.object({
      street: z.string().min(3).max(255),
      city: z.string().min(2).max(100),
      state: z.string().min(2).max(100),
      pin: z.string().min(4).max(12),
    });

    const parsedItems = z.array(itemSchema).safeParse(items);
    if (!parsedItems.success || parsedItems.data.length === 0) {
      return res.status(400).json({ message: "Invalid or empty cart items" });
    }

    const parsedAddress = addressSchema.safeParse(shippingAddress);
    if (!parsedAddress.success) {
      return res.status(400).json({ message: "Invalid shipping address details", errors: parsedAddress.error.errors });
    }

    const validatedItems = parsedItems.data;

    let subtotal = 0;
    const resolvedItems = [];
    
    // N+1 Fix: Fetch all products in one go
    const productIds = items.map((i: any) => i.productId || i.id);
    const validIds = productIds.filter((id: any) => mongoose.Types.ObjectId.isValid(id));
    const validSlugs = productIds.filter((id: any) => !mongoose.Types.ObjectId.isValid(id));

    const products = await Product.find({
      $or: [
        { _id: { $in: validIds } },
        { slug: { $in: validSlugs } }
      ]
    });

    // Create a map for quick lookup
    const productMap = new Map();
    products.forEach(p => productMap.set(p._id.toString(), p));
    products.forEach(p => productMap.set(p.slug, p));

    // Construct Bulk Operations for Atomic Update
    const bulkOps = [];
    const isCOD = paymentMethod === "Cash on Delivery";

    for (const item of validatedItems) {
      const idOrSlug = item.productId || item.id;
      if (!idOrSlug) {
        return res.status(400).json({ message: `Missing product ID for item ${item.name || 'Unknown'}` });
      }
      const product = productMap.get(idOrSlug.toString());

      if (!product) {
        return res.status(404).json({ message: `Product "${item.name || idOrSlug}" not found` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
      }

      subtotal += product.price * item.qty;
      resolvedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty: item.qty,
        variant: item.variant || "",
      });

      if (isCOD) {
        bulkOps.push({
          updateOne: {
            filter: { _id: product._id, stock: { $gte: item.qty } },
            update: { $inc: { stock: -item.qty } }
          }
        });
      }
    }

    const shippingFee = 0; // Free shipping over 50k
    const tax = 0;
    const total = subtotal + shippingFee;

    const orderNumber = "JW-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);

    const orderStatus = isCOD ? "Confirmed" : "Created";
    const paymentStatus = "Pending";

    const orderData: any = {
      orderNumber,
      items: resolvedItems,
      subtotal,
      shippingFee,
      tax,
      total,
      shippingAddress: parsedAddress.data,
      paymentMethod,
      orderStatus,
      paymentStatus,
      idempotencyKey,
      statusHistory: [
        { status: `Order Status: ${orderStatus}`, comment: "Order initialized" },
        { status: `Payment Status: ${paymentStatus}`, comment: "Payment initialized" }
      ]
    };

    if (req.user) {
      orderData.customer = req.user.id;
    } else {
      if (!guestInfo) {
         return res.status(401).json({ message: "You must be logged in to place an order, or provide guest info." });
      }
      orderData.guestInfo = guestInfo;
    }

    let razorpayOrder = null;
    if (!isCOD) {
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: total * 100, // paise
          currency: "INR",
          receipt: orderNumber
        });
        orderData.razorpayOrderId = razorpayOrder.id;
      } catch (rzpErr) {
        console.error("Razorpay Error:", rzpErr);
        return res.status(500).json({ message: "Payment gateway error" });
      }
    }

    session.startTransaction();

    // Execute atomic stock deduction (only for COD, Razorpay deductions happen on webhook)
    if (bulkOps.length > 0) {
      const result = await Product.bulkWrite(bulkOps, { session });
      if (result.modifiedCount !== bulkOps.length) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Race condition detected: Insufficient stock during checkout." });
      }
    }

    const order = await Order.create([orderData], { session });
    await session.commitTransaction();

    res.status(201).json(order[0]);
  } catch (error) {
    if (session.inTransaction()) {
       await session.abortTransaction();
    }
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error creating order" });
  } finally {
    session.endSession();
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    // Origin / CSRF check to prevent Cross-Site Request Forgery on payment verification
    const origin = req.get("origin") || req.get("referer");
    const allowedOrigins = [process.env.FRONTEND_URL || "http://localhost:3000"];
    
    // Check if origin starts with any allowed origin
    const isValidOrigin = origin && allowedOrigins.some(allowed => origin.startsWith(allowed));
    
    if (process.env.NODE_ENV === "production" && !isValidOrigin) {
      console.warn(`[Security] CSRF / Origin mismatch in verifyPayment. Origin: ${origin}`);
      return res.status(403).json({ message: "Invalid request origin" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Payment configuration missing" });
    }
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Call the centralized payment service
    const paymentResult = await processPaymentSuccess(razorpay_order_id, razorpay_payment_id, "Frontend");

    if (!paymentResult.success) {
      return res.status(400).json({ message: paymentResult.message });
    }

    const order = await Order.findById(paymentResult.order?._id).populate("customer", "name email");

    if (order) {
      // Send invoice email asynchronously
      const customerEmail = (order.customer as any)?.email || order.guestInfo?.email;
      if (customerEmail) {
        sendOrderInvoiceEmail(order, customerEmail).catch(err =>
          console.error("Invoice email error:", err)
        );
      }
    }

    res.status(200).json({ message: paymentResult.message, order });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Server error verifying payment" });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ customer: req.user?.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

export const adminGetOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("customer", "name email").sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

export const adminUpdateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderStatus, trackingId, trackingLink, courierPartner } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Restore stock if cancelling an order that already had stock deducted (e.g. Confirmed/Processing/Shipped/Delivered)
    if (orderStatus === "Cancelled" && order.orderStatus !== "Cancelled" && order.orderStatus !== "Created") {
      const bulkOps = order.items.map((item: any) => ({
        updateOne: {
          filter: { _id: item.productId },
          update: { $inc: { stock: item.qty } }
        }
      }));
      if (bulkOps.length > 0) {
        await Product.bulkWrite(bulkOps);
      }
    }

    const updatePayload: any = { orderStatus };
    if (trackingId !== undefined) updatePayload.trackingId = trackingId;
    if (trackingLink !== undefined) updatePayload.trackingLink = trackingLink;
    if (courierPartner !== undefined) updatePayload.courierPartner = courierPartner;

    const statusHistoryUpdate = { 
      status: `Order Status: ${orderStatus}`, 
      comment: "Updated by Admin" 
    };

    if (orderStatus === "Cancelled") {
       updatePayload.paymentStatus = "Refunded";
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        $set: updatePayload, 
        $push: { 
          statusHistory: orderStatus === "Cancelled" 
            ? [ statusHistoryUpdate, { status: "Payment Status: Refunded", comment: "Cancelled by Admin" } ]
            : statusHistoryUpdate 
        } 
      },
      { new: true }
    ).populate("customer", "name email");

    // Fire tracking email when tracking link is updated
    if (trackingLink && trackingLink.trim() !== "" && order.trackingLink !== trackingLink) {
      const customerEmail = (updatedOrder?.customer as any)?.email;
      if (customerEmail) {
        sendTrackingUpdateEmail(updatedOrder as any, customerEmail).catch(err =>
          console.error("Tracking email error:", err)
        );
      }
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error updating order" });
  }
};
