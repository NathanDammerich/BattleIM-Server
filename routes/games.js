import express from "express";

import {
  getGames,
  getGame,
  updateGame,
  createGames,
  getUpcomingGames,
  postResultsOfGame,
  deleteGame,
} from "../controllers/games.js";

import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/upcoming", verifyToken, getUpcomingGames);
router.get("/", verifyToken, getGames);
router.get("/:id", verifyToken, getGame);
router.patch("/:id", verifyToken, updateGame);
router.post("/", verifyToken, createGames);
router.post("/:id/results", verifyToken, postResultsOfGame);
router.delete("/:id", verifyToken, deleteGame);

export default router;
