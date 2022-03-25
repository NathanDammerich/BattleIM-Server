import express from "express";

import User from "../models/User.js";
import Team from "../models/Team.js";

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
  console.log(quizID);

  try {
    const user = await User.findById(id).lean();
    user.quizzesPassed.push(quizID);
    console.log(user);
    const newUser = await User.findByIdAndUpdate(id, user, { new: true });
    res.status(200).json(newUser);
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

export const acceptInvite = async (req, res) => {
  const { id } = req.params;
  const { teamID } = req.body;
  try {
    const user = await User.findById(id).lean();

    user.invites = user.invites.filter((invite) => invite != teamID);
    user.teams.push(teamID);

    const newUser = await User.findByIdAndUpdate(id, user);

    const team = await Team.findById(teamID).lean();

    team.invites = team.invites.filter((invite) => invite != id);
    team.players.push(id);

    const newTeam = await Team.findByIdAndUpdate(teamID, team);

    res.status(200).json(newUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
