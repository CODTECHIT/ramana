import { Router } from "express";
import { getUploadSignature } from "../controllers/uploadController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.use(adminAuth);

router.get("/signature", getUploadSignature);

export default router;
