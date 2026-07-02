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

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mockkey",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mocksecret",
});

export const createOrder = async (req: Request, res: Response) => {
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

    const parsedItems = z.array(itemSchema).safeParse(items);

    if (!parsedItems.success || parsedItems.data.length === 0) {
      return res.status(400).json({ message: "Invalid or empty cart items" });
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

      bulkOps.push({
        updateOne: {
          filter: { _id: product._id, stock: { $gte: item.qty } },
          update: { $inc: { stock: -item.qty } }
        }
      });
    }

    // Execute atomic stock deduction
    if (bulkOps.length > 0) {
      const result = await Product.bulkWrite(bulkOps);
      if (result.modifiedCount !== validatedItems.length) {
        return res.status(400).json({ message: "Race condition detected: Insufficient stock during checkout." });
      }
    }

    const shippingFee = 0; // Free shipping over 50k
    const tax = Math.round(subtotal * 0.03); // 3% GST on gold/jewellery
    const total = subtotal + shippingFee + tax;

    const orderNumber = "JW-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);

    const orderData: any = {
      orderNumber,
      items: resolvedItems,
      subtotal,
      shippingFee,
      tax,
      total,
      shippingAddress,
      paymentMethod,
      status: paymentMethod === "Cash on Delivery" ? "Processing" : "Pending"
    };

    if (req.user) {
      orderData.customer = req.user.id;
    } else {
      // Revert stock if auth fails
      const revertOps = bulkOps.map(op => ({
        updateOne: { filter: op.updateOne.filter, update: { $inc: { stock: op.updateOne.update.$inc.stock * -1 } } }
      }));
      await Product.bulkWrite(revertOps);
      return res.status(401).json({ message: "You must be logged in to place an order." });
    }

    let razorpayOrder = null;
    if (paymentMethod !== "Cash on Delivery") {
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: total * 100, // paise
          currency: "INR",
          receipt: orderNumber
        });
        orderData.razorpayOrderId = razorpayOrder.id;
      } catch (rzpErr) {
        // Revert stock if razorpay fails
        const revertOps = bulkOps.map(op => ({
          updateOne: { filter: { _id: op.updateOne.filter._id }, update: { $inc: { stock: op.updateOne.update.$inc.stock * -1 } } }
        }));
        await Product.bulkWrite(revertOps);
        console.error("Razorpay Error:", rzpErr);
        return res.status(500).json({ message: "Payment gateway error" });
      }
    }

    const order = await Order.create(orderData);
    res.status(201).json(order);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server error creating order" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || "mocksecret";
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { 
        status: "Processing", 
        "paymentDetails.transactionId": razorpay_payment_id 
      },
      { new: true }
    ).populate("customer", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send invoice email asynchronously (do not block response)
    const customerEmail = (order.customer as any)?.email || order.guestInfo?.email;
    if (customerEmail) {
      sendOrderInvoiceEmail(order, customerEmail).catch(err =>
        console.error("Invoice email error:", err)
      );
    }

    res.status(200).json({ message: "Payment verified successfully", order });
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
    const { status, trackingId, trackingLink, courierPartner } = req.body;

    const updatePayload: any = { status };
    if (trackingId !== undefined) updatePayload.trackingId = trackingId;
    if (trackingLink !== undefined) updatePayload.trackingLink = trackingLink;
    if (courierPartner !== undefined) updatePayload.courierPartner = courierPartner;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true }
    ).populate("customer", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Fire tracking email when tracking link is updated
    if (trackingLink && trackingLink.trim() !== "") {
      const customerEmail = (order.customer as any)?.email;
      if (customerEmail) {
        sendTrackingUpdateEmail(order, customerEmail).catch(err =>
          console.error("Tracking email error:", err)
        );
      }
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error updating order" });
  }
};
