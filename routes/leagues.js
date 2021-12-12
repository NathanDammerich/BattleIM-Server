import express from "express";

import {
  getLeague,
  updateLeague,
  createLeague,
} from "../controllers/leagues.js";

const router = express.Router();

router.get("/:id", getLeague);
router.patch("/:id", updateLeague);
router.post("/", createLeague);

export default router;
