import express from "express";

import { getOrg, updateOrg, createOrg } from "../controllers/orgs.js";

const router = express.Router();

router.get("/:id", getOrg);
router.patch("/:id", updateOrg);
router.post("/", createOrg);

export default router;
