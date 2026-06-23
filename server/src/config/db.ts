import mongoose from "mongoose";

export const connectDB = async () => {
  try {
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
    // In development we avoid exiting the process to allow the server to start
    // without a database. This makes it easier to develop UI without a local DB.
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};
