import { Router } from "express";
import { adminGetBanners, adminCreateBanner, adminUpdateBanner, adminDeleteBanner } from "../controllers/bannerController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.use(adminAuth);

router.get("/", adminGetBanners);
router.post("/", adminCreateBanner);
router.put("/:id", adminUpdateBanner);
router.delete("/:id", adminDeleteBanner);

export default router;
