import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
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
import { Category } from "./models/Category.js";
import { Collection } from "./models/Collection.js";
import { Product } from "./models/Product.js";

// Load env vars
dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true })); // Enable cookies cross-origin
app.use(helmet());
app.use(morgan("dev"));

import rateLimit from "express-rate-limit";
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
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

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "success", message: "Server is healthy and running." });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
