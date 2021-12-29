import express from "express";

import {
  getTeam,
  updateTeam,
  createTeam,
  getTeamsArray,
  removePlayer,
  addInvite,
} from "../controllers/teams.js";

const router = express.Router();

router.patch("/:teamID/removePlayer", removePlayer);
router.post("/:id/invites", addInvite);
router.get("/:id", getTeam);

router.patch("/:id", updateTeam);
router.post("/", createTeam);
router.post("/array", getTeamsArray);

export default router;
