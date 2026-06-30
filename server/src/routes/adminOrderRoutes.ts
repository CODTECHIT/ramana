import { Router } from "express";
import { adminGetOrders, adminUpdateOrderStatus } from "../controllers/orderController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.use(adminAuth);

router.get("/", adminGetOrders);
router.put("/:id", adminUpdateOrderStatus);

export default router;
