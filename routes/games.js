import express from "express";

import {
  getGames,
  getGame,
  updateGame,
  createGame,
} from "../controllers/games.js";

const router = express.Router();

router.get("/", getGames);
router.get("/:id", getGame);
router.patch("/:id", updateGame);
router.post("/", createGame);

export default router;
