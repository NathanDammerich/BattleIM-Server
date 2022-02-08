import express from "express";

import {
  signInUser,
  signUpUser,
  getNewToken,
  logout,
  signInAdmin,
  signUpAdmin,
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

router.post("/admin/signin", signInAdmin);
router.post("/admin/signup", signUpAdmin);

export default router;
