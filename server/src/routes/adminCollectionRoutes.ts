import { Router } from "express";
import { adminGetCollections, adminCreateCollection, adminUpdateCollection, adminDeleteCollection } from "../controllers/collectionController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();

router.use(adminAuth);

router.get("/", adminGetCollections);
router.post("/", adminCreateCollection);
router.put("/:id", adminUpdateCollection);
router.delete("/:id", adminDeleteCollection);

export default router;
