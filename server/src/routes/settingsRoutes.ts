import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

// Public route to get settings
router.get("/", getSettings);

// Admin route to update settings
router.put("/", adminAuth, updateSettings);

export default router;
