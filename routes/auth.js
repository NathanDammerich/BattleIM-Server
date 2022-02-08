import express from "express";

import {
  signInUser,
  signUpUser,
  getNewToken,
  logout,
} from "../controllers/auth.js";

import {
  verifyRefreshToken,
  verifyToken,
} from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/signin", signInUser);
router.post("/signup", signUpUser);
router.post("/token", verifyRefreshToken, getNewToken);
router.post("/logout", verifyToken, logout);

export default router;
