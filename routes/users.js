import express from "express";

import {
  getUser,
  createUser,
  addPassedQuiz,
  findUsers,
} from "../controllers/users.js";

import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.post("/", createUser);
router.patch("/:id/quiz", verifyToken, addPassedQuiz);
router.post("/findUsers", verifyToken, findUsers);

export default router;
