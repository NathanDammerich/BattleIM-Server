import express from "express";

import User from "../models/User.js";

const router = express.Router();

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .populate({
        path: "teams",
        populate: {
          path: "games",
          populate: {
            path: "opponent",
          },
        },
      })
      .populate("orgs");

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, male, orgs, teams } = req.body;

    const user = new User({
      name,
      male,
      teams,
      invites: [],
      orgs,
      quizzesPassed: [],
      stats: {},
    });

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default router;
