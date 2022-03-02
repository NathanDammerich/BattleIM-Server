import express from "express";

import {
  getUser,
  createUser,
  addPassedQuiz,
  findUsers,
  acceptInvite,
} from "../controllers/users.js";

import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.patch("/:id/quiz", verifyToken, addPassedQuiz);
router.patch("/:id/acceptInvite", verifyToken, acceptInvite);
router.get("/:id", verifyToken, getUser);
router.post("/", createUser);
router.post("/findUsers", verifyToken, findUsers);

export default router;
