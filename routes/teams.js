import express from "express";

import {
  getTeam,
  updateTeam,
  createTeam,
  getTeamsArray,
  removePlayer,
  invitePlayer,
} from "../controllers/teams.js";

import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.patch("/:id/removePlayer", verifyToken, removePlayer);
router.patch("/:id/invitePlayer", verifyToken, invitePlayer);
router.get("/:id", verifyToken, getTeam);

router.patch("/:id", verifyToken, updateTeam);
router.post("/", verifyToken, createTeam);
router.post("/array", verifyToken, getTeamsArray);

export default router;
