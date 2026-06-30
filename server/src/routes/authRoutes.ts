import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, logout, refresh, getMe, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = Router();

// Rate limiting for login: 5 requests per 15 minutes (or 100 in development)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 5 : 100,
  message: { message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for password reset: 3 requests per 15 minutes
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: "Too many password reset requests, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

import { protect } from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
