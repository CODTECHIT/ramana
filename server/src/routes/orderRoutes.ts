import { Router } from "express";
import { createOrder, getMyOrders, verifyPayment } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Guest checkout can post without logging in, but if logged in, it links the user
router.post("/", (req, res, next) => {
  if (req.cookies.accessToken || req.cookies.refreshToken) {
    protect(req, res, next);
  } else {
    next();
  }
}, createOrder);

router.post("/verify", verifyPayment);

router.get("/my", protect, getMyOrders);

export default router;
