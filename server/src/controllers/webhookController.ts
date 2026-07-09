import { Request, Response } from "express";
import crypto from "crypto";
import { Order } from "../models/Order.js";
import { processPaymentSuccess } from "../services/paymentService.js";

export const razorpayWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not defined");
      return res.status(500).json({ message: "Webhook secret missing" });
    }

    const signature = req.headers["x-razorpay-signature"];
    if (!signature || typeof signature !== "string") {
      return res.status(400).json({ message: "Signature missing" });
    }

    // Since we use express.raw for this route, req.body should be a Buffer
    const body = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("Invalid Razorpay webhook signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const eventPayload = JSON.parse(body.toString("utf8"));
    const event = eventPayload.event;

    if (event === "payment.captured") {
      const payment = eventPayload.payload.payment.entity;
      const orderId = payment.order_id;
      
      const result = await processPaymentSuccess(orderId, payment.id, "Webhook");
      if (result.success) {
        console.log(`Payment captured and processed for Razorpay order ${orderId}`);
      } else {
        console.log(`Payment processed but overselling detected for Razorpay order ${orderId}`);
      }
    } else if (event === "payment.failed") {
      const payment = eventPayload.payload.payment.entity;
      const orderId = payment.order_id;

      const order = await Order.findOne({ razorpayOrderId: orderId, paymentStatus: "Pending" });
      if (order) {
         order.orderStatus = "Cancelled";
         order.paymentStatus = "Failed";
         order.statusHistory.push(
            { status: "Order Status: Cancelled", comment: "Payment failed via webhook" },
            { status: "Payment Status: Failed", comment: "Payment failed via webhook" }
         );
         await order.save();
      }

      console.log(`Payment failed for Razorpay order ${orderId}`);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
