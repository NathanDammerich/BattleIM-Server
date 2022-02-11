import express from "express";

import {
  getOrg,
  updateOrg,
  createOrg,
  getGamesOnDate,
} from "../controllers/orgs.js";

import {
  verifyToken,
  verifyTokenAdmin,
} from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/:id/date", verifyToken, getGamesOnDate);
router.get("/:id", verifyToken, getOrg);
router.patch("/:id", verifyToken, updateOrg);
router.post("/", verifyToken, createOrg);

export default router;
