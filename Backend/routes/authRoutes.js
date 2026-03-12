import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerUser, login, getMe } from "../controllers/authController.js";

const router = express.Router();

// Define your authentication routes here
// For example:
// router.post("/register", (req, res) => { ... });
// router.post("/login", (req, res) => { ... });

router.post("/register", registerUser);
router.post("/login", login);
router.get("/get-me", protect, getMe); //protecte route

export default router;