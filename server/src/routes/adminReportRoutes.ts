import { Router } from "express";
import { getDashboardReports } from "../controllers/reportController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.use(adminAuth);

router.get("/", getDashboardReports);

export default router;
