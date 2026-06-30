import mongoose from "mongoose";

const paymentMethodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["upi", "card", "netbanking"], required: true },
    label: { type: String, required: true },
    detail: { type: String, required: true }, // e.g. upi id or masked card
    bank: { type: String }, // optional
    icon: { type: String }, // emoji or string icon
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.PaymentMethod || mongoose.model("PaymentMethod", paymentMethodSchema);
