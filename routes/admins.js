import express from "express";

import { getAdmin } from "../controllers/admins.js";

const router = express.Router();

router.get("/:id", getAdmin);

export default router;
