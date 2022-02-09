import express from "express";

import {
  getGames,
  getGame,
  updateGame,
  createGame,
  getUpcomingGames,
  postResultsOfGame,
} from "../controllers/games.js";

import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/upcoming", verifyToken, getUpcomingGames);
router.get("/", verifyToken, getGames);
router.get("/:id", verifyToken, getGame);
router.patch("/:id", verifyToken, updateGame);
router.post("/", verifyToken, createGame);
router.post("/:id/results", verifyToken, postResultsOfGame);

export default router;
