import express from "express";

import League from "../models/league.js";

const router = express.Router();

export const getLeague = async (req, res) => {
  try {
    const { id } = req.params;
    const league = await League.findById(id)
      .populate("sport")
      .populate("org")
      .populate("divisions");

    res.status(200).json(league);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateLeague = async (req, res) => {
  try {
    const { id } = req.params;
    const { sport, games, teams, org } = req.body;

    const updatedLeague = { sport, games, teams, org, _id: id };

    await League.findByIdAndUpdate(id, updatedLeague, { new: true });

    res.status(200).json(updatedLeague);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createLeague = async (req, res) => {
  try {
    const { sport, games, teams, org } = req.body;

    const newLeague = new League({ sport, games, teams, org })
      .populate("sport")
      .populate("games")
      .populate("teams")
      .populate("org");

    await newLeague.save();

    res.status(201).json(newLeague);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
