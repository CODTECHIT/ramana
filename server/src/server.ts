import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminCategoryRoutes from "./routes/adminCategoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import adminBannerRoutes from "./routes/adminBannerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminCustomerRoutes from "./routes/adminCustomerRoutes.js";
import adminReportRoutes from "./routes/adminReportRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import adminCollectionRoutes from "./routes/adminCollectionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import { Category } from "./models/Category.js";
import { Collection } from "./models/Collection.js";
import { Product } from "./models/Product.js";

// Load env vars
dotenv.config();

// Startup Sanity Checks
const requiredEnvVars = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET", "MONGODB_URI"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`🚨 FATAL ERROR: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
app.set("trust proxy", 1);

// Ensure Database is connected before handling routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// Webhook must be parsed as raw body before global express.json() applies
app.use("/api/orders/webhook", express.raw({ type: "application/json" }));

// Middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://ramana-ruby.vercel.app",
  "http://localhost:3000",
  "https://www.ramanajewells.com",
  "https://ramanajewells.com"
];
app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));

app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("dev"));

import rateLimit from "express-rate-limit";
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Increased for development
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 login/register attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts, please try again after 15 minutes",
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Max 5 reset requests per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many password reset attempts, please try again after 1 hour",
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", passwordResetLimiter);
app.use("/api/", apiLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/upload", uploadRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/admin/banners", adminBannerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/customers", adminCustomerRoutes);
app.use("/api/admin/reports", adminReportRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/admin/collections", adminCollectionRoutes);
app.use("/api/user", userRoutes);
app.use("/api/settings", settingsRoutes);

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Server is healthy and running." });
});

import { errorHandler } from "./middleware/errorHandler.js";
app.use(errorHandler);

import Razorpay from "razorpay";
import { startReconciliationJob } from "./jobs/reconciliation.js";

// Start Server
if (process.env.NODE_ENV !== "production" || process.env.RUN_LOCAL === "true") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      startReconciliationJob(razorpay);
    } else {
      console.warn("⚠️ Razorpay keys missing, skipping Reconciliation Job.");
    }
  });
}

export default app;
