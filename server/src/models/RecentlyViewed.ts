import mongoose from "mongoose";

const recentlyViewedSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

// We want to keep only recent items, but we can do that in logic or with TTL
export default mongoose.models.RecentlyViewed || mongoose.model("RecentlyViewed", recentlyViewedSchema);
