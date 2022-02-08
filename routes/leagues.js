import express from "express";

import {
  getLeague,
  updateLeague,
  createLeague,
} from "../controllers/leagues.js";

import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getLeague);
router.patch("/:id", verifyToken, updateLeague);
router.post("/", verifyToken, createLeague);

export default router;
