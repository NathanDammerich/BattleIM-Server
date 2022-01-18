import express from "express";

import {
  getGames,
  getGame,
  updateGame,
  createGame,
  getUpcomingGames,
  postResultsOfGame,
} from "../controllers/games.js";

const router = express.Router();

router.post("/upcoming", getUpcomingGames);
router.get("/", getGames);
router.get("/:id", getGame);
router.patch("/:id", updateGame);
router.post("/", createGame);
router.post("/:id/results", postResultsOfGame);

export default router;
