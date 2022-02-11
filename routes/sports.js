import express from "express";

import {
  getSport,
  updateSport,
  createSport,
  listSports,
} from "../controllers/sports.js";

import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getSport);
router.patch("/:id", verifyToken, updateSport);
router.post("/", verifyToken, createSport);
router.get("/", verifyToken, listSports);

export default router;
