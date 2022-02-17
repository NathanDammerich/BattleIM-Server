import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();
import { client } from "../redis_connect.js";

import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const oldUser = await User.findOne({ email });

    if (!oldUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(oldUser._id);
    const refreshToken = await generateRefreshToken(oldUser._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
      sameSite: "none",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({ user: oldUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const googleSignIn = async (req, res) => {
  console.log("called googlesignin");
  const { token } = req.body;
  const client = new OAuth2Client(
    "451600223630-o1sf43rnm26bg390ebu6ft3190edkdar.apps.googleusercontent.com"
  );
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "451600223630-o1sf43rnm26bg390ebu6ft3190edkdar.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    const userEmail = payload.email;
    try {
      const user = await User.findOne({ email: userEmail });

      const accessToken = generateAccessToken(user._id);
      const refreshToken = await generateRefreshToken(user._id);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15,
        sameSite: "none",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: "none",
        secure: true,
      });
      res.status(200).json({ user: user, new: false });
    } catch (error) {
      const newUser = await User.create({
        email: userEmail,
        name: payload.name,
      });
      const accessToken = generateAccessToken(newUser._id);
      const refreshToken = await generateRefreshToken(newUser._id);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15,
        sameSite: "none",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: "none",
        secure: true,
      });
      res.status(200).json({ user: newUser, new: true });
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

export const googleSignInAdmin = async (req, res) => {
  console.log("called googlesignin");
  const { token } = req.body;
  const client = new OAuth2Client(
    "451600223630-o1sf43rnm26bg390ebu6ft3190edkdar.apps.googleusercontent.com"
  );
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "451600223630-o1sf43rnm26bg390ebu6ft3190edkdar.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    const userEmail = payload.email;
    try {
      const user = await Admin.findOne({ email: userEmail });

      const accessToken = generateAccessToken(user._id);
      const refreshToken = await generateRefreshToken(user._id);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15,
        sameSite: "none",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: "none",
        secure: true,
      });
      res.status(200).json({ user: user, new: false });
    } catch (error) {
      const newUser = await Admin.create({
        email: userEmail,
        name: payload.name,
        orgs: ["617f480dfec82da4aec5705c"],
      });
      const accessToken = generateAccessToken(newUser._id);
      const refreshToken = await generateRefreshToken(newUser._id);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15,
        sameSite: "none",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: "none",
        secure: true,
      });
      res.status(200).json({ user: newUser, new: true });
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

export const signUpUser = async (req, res) => {
  const saltRounds = 12;
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = generateAccessToken(newUser._id);
    const refreshToken = await generateRefreshToken(newUser._id);

    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
      sameSite: "none",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: "none",
      secure: true,
    });

    return res.status(201).json({ user: newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const signInAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const oldAdmin = await Admin.findOne({ email }).populate("org");

    if (!oldAdmin) {
      return res.status(404).json({ message: "Admin doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldAdmin.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessTokenAdmin(oldAdmin._id);
    const refreshToken = await generateRefreshTokenAdmin(oldAdmin._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
      sameSite: "none",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({ admin: oldAdmin });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const signUpAdmin = async (req, res) => {
  const saltRounds = 12;
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldAdmin = await Admin.findOne({ email });

    if (oldAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newAdmin = await Admin.create({
      email: email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = generateAccessTokenAdmin(newAdmin._id);
    const refreshToken = await generateRefreshTokenAdmin(newAdmin._id);

    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
      sameSite: "none",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: "none",
      secure: true,
    });

    return res.status(201).json({ admin: newAdmin });
  } catch (error) {
    return res.status(500).json({ message: error.message });

    console.log(error);
  }
};

export const logout = async (req, res) => {
  console.log("logout called");
  const { userID } = req.user;
  const token = req.cookies.accessToken;

  try {
    await client.del(userID.toString());
    await client.set("BL_" + userID.toString(), token);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const logoutAdmin = async (req, res) => {
  const { adminID } = req.admin;
  const token = req.cookies.accessToken;

  try {
    await client.del(adminID.toString());
    await client.set("BL_" + adminID.toString(), token);
    console.log("logoutAdmin successful");
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getNewToken = async (req, res) => {
  const { userID } = req.user;
  console.log(userID);

  const accessToken = generateAccessToken(userID);
  const refreshToken = await generateRefreshToken(userID);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 15,
    sameSite: "none",
    secure: true,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    sameSite: "none",
    secure: true,
  });
  try {
    const user = await User.findById(userID);
    res.status(201).json({ user: user });
  } catch (error) {
    res.sendStatus(404);
  }
};

export const getNewTokenAdmin = async (req, res) => {
  const { adminID } = req.admin;

  const accessToken = generateAccessTokenAdmin(adminID);
  const refreshToken = await generateRefreshTokenAdmin(adminID);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 15,
    sameSite: "none",
    secure: true,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
    sameSite: "none",
    secure: true,
  });
  try {
    const admin = await Admin.findById(adminID).populate("org");
    res.status(201).json({ admin: admin });
  } catch (error) {
    res.sendStatus(404);
  }
};

const generateAccessToken = (userID) => {
  return jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = async (userID) => {
  console.log(`userID in generateRefreshToken: ${userID}`);
  const refreshToken = jwt.sign({ userID }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  client.get(userID, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log(data);
    console.log(`userID in generateRefreshToken: ${userID}`);
    client.set(userID, JSON.stringify({ token: refreshToken }));
  });

  return refreshToken;
};

const generateAccessTokenAdmin = (adminID) => {
  return jwt.sign({ adminID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshTokenAdmin = async (adminID) => {
  console.log(`adminID in generateRefreshTokenAdmin: ${adminID}`);
  const refreshToken = jwt.sign({ adminID }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  client.get(adminID, (err, data) => {
    if (err) {
      console.log(err);
    }
    console.log(data);
    client.set(adminID, JSON.stringify({ token: refreshToken }));
  });

  return refreshToken;
};
