import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.status(200).json({ user: oldUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.status(201).json({ user: newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const signInAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const oldAdmin = await Admin.findOne({ email });

    if (!oldAdmin) {
      return res.status(404).json({ message: "Admin doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, oldAdmin.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(oldAdmin._id);
    const refreshToken = await generateRefreshToken(oldAdmin._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
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

    const token = generateAccessToken(newAdmin._id);
    const refreshToken = await generateRefreshToken(newAdmin._id);

    res.cookie("accessToken", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
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

export const getNewToken = async (req, res) => {
  const { userID } = req.user;
  console.log(userID);

  const accessToken = generateAccessToken(userID);
  const refreshToken = await generateRefreshToken(userID);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 15,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
  try {
    const user = await User.findById(userID);
    res.status(201).json({ user: user });
  } catch (error) {
    res.sendStatus(404);
  }
};

const generateAccessToken = (userID) => {
  return jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });
};

const generateRefreshToken = async (userID) => {
  const refreshToken = jwt.sign({ userID }, process.env.REFRESH_TOKEN_SECRET);

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
