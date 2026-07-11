import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn(
        "⚠️ MONGODB_URI not set — skipping MongoDB connection (development fallback).",
      );
      return;
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:");
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    // Throw error so that the serverless function can handle it gracefully
    // instead of crashing the Node process (which causes 500s on Vercel)
    throw error;
  }
};
