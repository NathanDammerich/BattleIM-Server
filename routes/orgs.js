import express from "express";

import {
  getOrg,
  updateOrg,
  createOrg,
  getGamesOnDate,
} from "../controllers/orgs.js";

const router = express.Router();

router.post("/:id/date", getGamesOnDate);
router.get("/:id", getOrg);
router.patch("/:id", updateOrg);
router.post("/", createOrg);

export default router;
