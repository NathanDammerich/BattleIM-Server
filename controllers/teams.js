import express from "express";

import Team from "../models/Team.js";

const router = express.Router();

export const getTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id)
      .populate({
        path: "games",
        populate: {
          path: "opponent",
        },
      })
      .populate("players")
      .populate("org");

    res.status(200).json(team);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);

    const { name, games, players } = req.body;

    team.name = name;
    team.games = games;
    team.players = players;

    const updatedTeam = await Team.findByIdAndUpdate(id, team, { new: true })
      .populate("games")
      .populate("players")
      .populate("org");

    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { name, games, players, league } = req.body;

    const newTeam = new Team({
      name,
      games,
      players,
      league,
      wins: 0,
      losses: 0,
    });

    await newTeam.save();

    res.status(200).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export default router;
