import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: Types.ObjectId;
  price: number;
  stock: number;
  weight?: string;
  metalPurity?: string;
  occasionTags: string[];
  setContents: string[];
  sizes?: string[];
  images: string[];
  colors?: { name: string; images: string[] }[];
  active: boolean;
  tag?: string; // e.g. "Bestseller", "New"
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    weight: { type: String }, // e.g. "45.2g"
    metalPurity: { type: String }, // e.g. "22KT"
    occasionTags: [{ type: String }],
    setContents: [{ type: String }],
    sizes: [{ type: String }],
    images: [{ type: String }], // Cloudinary URLs
    colors: [
      {
        name: { type: String, required: true },
        images: [{ type: String }],
      },
    ],
    active: { type: Boolean, default: true },
    tag: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
