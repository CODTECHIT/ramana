import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  qty: number;
  variant?: string; // e.g. "Size 18" or metal purity
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
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
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
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
      index: true,
    },
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

export const Order =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
