import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  qty: number;
  variant?: string; // e.g. "Size 18" or metal purity
}

export interface IStatusHistory {
  status: string;
  timestamp: Date;
  comment?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer?: Types.ObjectId; // null if guest checkout
  guestInfo?: { name: string; email: string; phone: string };
  items: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  
  orderStatus: "Created" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Authorized" | "Captured" | "Failed" | "Refunded";
  
  idempotencyKey?: string;
  stockDeducted: boolean;
  statusHistory: IStatusHistory[];

  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pin: string;
  };
  paymentMethod: string;
  razorpayOrderId?: string;
  paymentDetails?: {
    transactionId: string;
  };
  trackingId?: string;
  trackingLink?: string;
  courierPartner?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    variant: { type: String },
  },
  { _id: false },
);

const StatusHistorySchema = new Schema<IStatusHistory>(
  {
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    comment: { type: String },
  },
  { _id: false }
);

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", index: true },
    guestInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },
    
    orderStatus: {
      type: String,
      enum: ["Created", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Created",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Authorized", "Captured", "Failed", "Refunded"],
      default: "Pending",
      index: true,
    },
    
    idempotencyKey: { 
      type: String, 
      index: { unique: true, sparse: true } 
    },
    stockDeducted: { type: Boolean, default: false },
    statusHistory: [StatusHistorySchema],

    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pin: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    razorpayOrderId: { type: String },
    paymentDetails: {
      transactionId: { type: String },
    },
    trackingId: { type: String },
    trackingLink: { type: String },
    courierPartner: { type: String },
  },
  {
    timestamps: true,
  },
);

OrderSchema.pre("validate", function (next) {
  const doc = this as unknown as IOrder;
  if (!doc.customer && (!doc.guestInfo || !doc.guestInfo.email)) {
    return next(
      new Error("Order must have either a customer reference or guest email."),
    );
  }
  next();
});

OrderSchema.pre("save", function (next) {
  if (this.isModified("orderStatus") && !this.isNew) {
    const original = this.$locals.originalOrderStatus || "Created";
    const current = this.orderStatus;
    
    // Valid transitions
    const validTransitions: Record<string, string[]> = {
      "Created": ["Confirmed", "Cancelled"],
      "Confirmed": ["Processing", "Cancelled"],
      "Processing": ["Shipped", "Cancelled"],
      "Shipped": ["Delivered", "Cancelled"],
      "Delivered": [],
      "Cancelled": []
    };

    if (validTransitions[original] && !validTransitions[original].includes(current)) {
      // In a real system, you might throw an Error here.
      // But we will just log a warning to avoid breaking any custom flows immediately.
      console.warn(`[State Machine] Invalid order status transition from ${original} to ${current} on order ${this.orderNumber}`);
    }
  }

  if (this.isModified("paymentStatus") && !this.isNew) {
    const original = this.$locals.originalPaymentStatus || "Pending";
    const current = this.paymentStatus;
    
    const validTransitions: Record<string, string[]> = {
      "Pending": ["Authorized", "Captured", "Failed"],
      "Authorized": ["Captured", "Failed"],
      "Captured": ["Refunded"],
      "Failed": [],
      "Refunded": []
    };

    if (validTransitions[original] && !validTransitions[original].includes(current)) {
      console.warn(`[State Machine] Invalid payment status transition from ${original} to ${current} on order ${this.orderNumber}`);
    }
  }
  next();
});

// Capture original state before save
OrderSchema.post("init", function(doc) {
  doc.$locals.originalOrderStatus = doc.orderStatus;
  doc.$locals.originalPaymentStatus = doc.paymentStatus;
});

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
