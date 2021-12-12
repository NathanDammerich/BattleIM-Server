import express from "express";

import { getSport, updateSport, createSport } from "../controllers/sports.js";

const router = express.Router();

router.get("/:id", getSport);
router.patch("/:id", updateSport);
router.post("/", createSport);

export default router;
