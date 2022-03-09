import express from "express";

import {
  getDivision,
  createDivision,
  updateDivision,
  deleteDivision,
} from "../controllers/divisions.js";

import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getDivision);
router.post("/", verifyToken, createDivision);
router.patch("/:id", verifyToken, updateDivision);
router.delete("/:id", verifyToken, deleteDivision);

export default router;
