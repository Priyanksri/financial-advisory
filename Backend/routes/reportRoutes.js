import express from "express";
import { generatePDFReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/pdf", protect, generatePDFReport);

export default router;