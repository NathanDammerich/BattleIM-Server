import express from "express";

import {
  getTeam,
  updateTeam,
  createTeam,
  getTeamsArray,
  removePlayer,
  addInvite,
} from "../controllers/teams.js";

import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.patch("/:teamID/removePlayer", verifyToken, removePlayer);
router.post("/:id/invites", verifyToken, addInvite);
router.get("/:id", verifyToken, getTeam);

router.patch("/:id", verifyToken, updateTeam);
router.post("/", verifyToken, createTeam);
router.post("/array", verifyToken, getTeamsArray);

export default router;
