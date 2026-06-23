import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, logout, refresh, getMe } from "../controllers/authController.js";

const router = Router();

// Rate limiting for login: 5 requests per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

import { protect } from "../middleware/authMiddleware.js";

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", protect, getMe);

export default router;
