import express from "express";

import User from "../models/User.js";

const router = express.Router();

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

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

export const addPassedQuiz = async (req, res) => {
  const { id } = req.params;
  const { quizID } = req.body;
  console.log(id);
  console.log(req.body);

  try {
    const user = User.findByIdAndUpdate(
      id,
      { $addToSet: { quizzesPassed: quizID } },
      {
        new: true,
      },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
    );
  } catch (error) {
    res.status(404).json(error);
  }
};

export const findUsers = async (req, res) => {
  const { orgID, queryString } = req.body;
  console.log(queryString);
  try {
    let users = await User.find({
      name: { $regex: queryString, $options: "i" },
    });
    users = users.filter((user) => user.orgs.includes(orgID));
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
