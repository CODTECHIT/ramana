import mongoose from "mongoose";

const savedItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.SavedItem || mongoose.model("SavedItem", savedItemSchema);
