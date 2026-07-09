import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";

export const processPaymentSuccess = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  source: "Webhook" | "Frontend" | "Reconciliation"
) => {
  const order = await Order.findOneAndUpdate(
    { razorpayOrderId, stockDeducted: { $ne: true } },
    { stockDeducted: true },
    { new: true }
  );

  if (!order) {
    const existing = await Order.findOne({ razorpayOrderId });
    if (existing && existing.paymentStatus !== "Captured") {
        existing.paymentStatus = "Captured";
        if (!existing.paymentDetails) existing.paymentDetails = { transactionId: razorpayPaymentId };
        else existing.paymentDetails.transactionId = razorpayPaymentId;
        await existing.save();
    }
    return { success: true, message: "Payment already processed", order: existing };
  }

  // Idempotent stock deduction
  const bulkOps = order.items.map((item: any) => ({
    updateOne: {
      filter: { _id: item.productId, stock: { $gte: item.qty } },
      update: { $inc: { stock: -item.qty } }
    }
  }));

  let oversold = false;
  if (bulkOps.length > 0) {
    const result = await Product.bulkWrite(bulkOps);
    if (result.modifiedCount !== order.items.length) {
      console.error(`Overselling detected for order ${order.orderNumber}. Stock not sufficient.`);
      oversold = true;
    }
  }

  if (oversold) {
    order.orderStatus = "Cancelled";
    order.paymentStatus = "Captured";
    if (!order.paymentDetails) order.paymentDetails = { transactionId: "" };
    order.paymentDetails.transactionId = razorpayPaymentId;
    order.statusHistory.push(
      { status: "Order Status: Cancelled", comment: `Payment captured via ${source} but stock insufficient` },
      { status: "Payment Status: Captured", comment: `Payment captured via ${source}` }
    );
  } else {
    order.orderStatus = "Confirmed";
    order.paymentStatus = "Captured";
    if (!order.paymentDetails) order.paymentDetails = { transactionId: "" };
    order.paymentDetails.transactionId = razorpayPaymentId;
    order.statusHistory.push(
      { status: "Order Status: Confirmed", comment: `Payment captured via ${source}` },
      { status: "Payment Status: Captured", comment: `Payment captured via ${source}` }
    );
  }
  await order.save();
  return { success: !oversold, message: oversold ? "Stock unavailable. Payment captured but order cancelled." : "Payment verified successfully", order };
};
