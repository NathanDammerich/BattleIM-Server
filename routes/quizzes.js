import express from "express";

import { getQuiz, createQuiz } from "../controllers/quizzes.js";

import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getQuiz);
router.post("/", verifyToken, createQuiz);

export default router;
