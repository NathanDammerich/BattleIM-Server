import express from "express";

import { getQuiz, createQuiz } from "../controllers/quizzes.js";

const router = express.Router();

router.get("/:id", getQuiz);
router.post("/", createQuiz);

export default router;
