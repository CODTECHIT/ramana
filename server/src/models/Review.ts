import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  productName: string;
  productImage?: string;
  rating: number; // 1-5
  title: string;
  body: string;
  images?: string[];
  order?: Types.ObjectId;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    productName: { type: String, required: true },
    productImage: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    images: [{ type: String }],
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One review per user per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export const Review =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
