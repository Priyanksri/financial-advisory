import express from "express";
import {
  setBudget,
  getBudgets,
  updateBudget,
} from "../controllers/budgetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, setBudget);
router.get("/", protect, getBudgets);
router.patch("/:id", protect, updateBudget);

export default router;
