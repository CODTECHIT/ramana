import mongoose, { Schema, Document } from "mongoose";

export interface ICollection extends Document {
  title: string;
  description?: string;
  image: string; // Cloudinary or Unsplash URL
  cta?: string; // Button text e.g. "Explore Collection"
  link?: string; // Redirect path e.g. /collections/bridal-sets
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    cta: { type: String, default: "Explore Collection" },
    link: { type: String, default: "/collections/all" },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Collection = mongoose.models.Collection || mongoose.model<ICollection>("Collection", CollectionSchema);
