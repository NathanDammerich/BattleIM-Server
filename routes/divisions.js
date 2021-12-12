import express from "express";

import { getDivision, createDivision } from "../controllers/divisions.js";

const router = express.Router();

router.get("/:id", getDivision);
router.post("/", createDivision);

export default router;
