import express from "express";

import { getTeam, updateTeam, createTeam } from "../controllers/teams.js";

const router = express.Router();

router.get("/:id", getTeam);
router.patch("/:id", updateTeam);
router.post("/", createTeam);

export default router;
