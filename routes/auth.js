import express from "express";

import {
  signInUser,
  signUpUser,
  getNewToken,
  logout,
  signInAdmin,
  signUpAdmin,
  getNewTokenAdmin,
  logoutAdmin,
  googleSignIn,
  googleSignInAdmin,
} from "../controllers/auth.js";

import {
  verifyRefreshToken,
  verifyToken,
  verifyRefreshTokenAdmin,
  verifyTokenAdmin,
} from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/admin/signin", signInAdmin);
router.post("/admin/signup", signUpAdmin);
router.post("/admin/token", verifyRefreshTokenAdmin, getNewTokenAdmin);
router.post("/admin/logout", verifyToken, logoutAdmin);

router.post("/signin", signInUser);
router.post("/signup", signUpUser);
router.post("/token", verifyRefreshToken, getNewToken);
router.post("/logout", verifyToken, logout);

router.post("/googlesignin", googleSignIn);
router.post("/admin/googlesignin", googleSignInAdmin);

export default router;
