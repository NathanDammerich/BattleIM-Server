import express from "express";

import {
  getUser,
  createUser,
  addPassedQuiz,
  findUsers,
} from "../controllers/users.js";

const router = express.Router();

router.get("/:id", getUser);
router.post("/", createUser);
router.patch("/:id/quiz", addPassedQuiz);
router.post("/findUsers", findUsers);

export default router;
