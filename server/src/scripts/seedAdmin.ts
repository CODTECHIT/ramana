import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      console.error("❌ ADMIN_EMAIL/SEED_ADMIN_EMAIL or ADMIN_PASSWORD/SEED_ADMIN_PASSWORD missing in .env");
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists. If you want to reset the password, delete the user from DB first.");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(12); // cost factor 12 per requirements
    const passwordHash = await bcrypt.hash(password, salt);

    await User.create({
      name: "Admin",
      email,
      passwordHash,
      role: "admin",
    });

    console.log("✅ Admin user seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Failed:", error);
    process.exit(1);
  }
};

seedAdmin();
