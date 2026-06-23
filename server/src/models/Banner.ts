import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  title?: string;
  subtitle?: string;
  image: string; // Cloudinary URL
  link?: string;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    title: { type: String },
    subtitle: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Banner = mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);
