import { Order } from "../models/Order.js";
import Razorpay from "razorpay";
import { Product } from "../models/Product.js";
import { processPaymentSuccess } from "../services/paymentService.js";

let isRunning = false;

export const startReconciliationJob = (razorpay: Razorpay) => {
  // Run every 30 minutes
  setInterval(async () => {
     if (isRunning) {
         console.warn("[Reconciliation Job] Previous job still running, skipping this interval.");
         return;
     }
     isRunning = true;
     try {
        console.log("[Reconciliation Job] Starting...");
        // Find orders created more than 30 mins ago, still Pending
        const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
        
        // Paginate/limit to prevent memory exhaustion
        const pendingOrders = await Order.find({
            paymentStatus: "Pending",
            createdAt: { $lt: thirtyMinsAgo },
            razorpayOrderId: { $exists: true }
        }).limit(100);

        for (const order of pendingOrders) {
            try {
                // Fetch actual status from Razorpay
                const payments = await razorpay.orders.fetchPayments(order.razorpayOrderId as string);
                const successfulPayment = payments.items.find((p: any) => p.status === "captured");

                if (successfulPayment) {
                    console.log(`[Reconciliation Job] Found captured payment for order ${order.orderNumber}. Recovering...`);
                    
                    // Claim order idempotently using the centralized service
                    const result = await processPaymentSuccess(order.razorpayOrderId as string, successfulPayment.id, "Reconciliation");
                    if (result.success) {
                        console.log(`[Reconciliation Job] Payment recovered and stock deducted for order ${order.orderNumber}`);
                    } else {
                        console.log(`[Reconciliation Job] Payment recovered but overselling detected for order ${order.orderNumber}`);
                    }
                } else {
                    console.log(`[Reconciliation Job] Order ${order.orderNumber} abandoned. Cancelling...`);
                    order.orderStatus = "Cancelled";
                    order.paymentStatus = "Failed";
                    order.statusHistory.push(
                        { status: "Order Status: Cancelled", comment: "Cancelled by Reconciliation Job (Timeout)" },
                        { status: "Payment Status: Failed", comment: "Cancelled by Reconciliation Job (Timeout)" }
                    );
                    await order.save();
                }
            } catch (err) {
                console.error(`[Reconciliation Job] Error processing order ${order.orderNumber}:`, err);
            }
        }
        console.log("[Reconciliation Job] Finished.");
     } catch (error) {
         console.error("[Reconciliation Job] Fatal Error:", error);
     } finally {
         isRunning = false;
     }
  }, 30 * 60 * 1000);
};
