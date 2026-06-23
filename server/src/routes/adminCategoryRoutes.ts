import { Router } from "express";
import { createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.use(adminAuth); // Protect all routes below

router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
