import { Router } from "express";
import { getCollections } from "../controllers/collectionController.js";

const router = Router();

router.get("/", getCollections);

export default router;
