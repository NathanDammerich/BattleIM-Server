import express from "express";

import { getDivision, createDivision } from "../controllers/divisions.js";

import { verifyToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/:id", verifyToken, getDivision);
router.post("/", verifyToken, createDivision);

export default router;
