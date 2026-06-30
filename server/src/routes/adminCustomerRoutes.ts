import { Router } from "express";
import { getCustomers } from "../controllers/customerController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.use(adminAuth);

router.get("/", getCustomers);

export default router;
