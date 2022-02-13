import express from "express";

import League from "../models/League.js";

const router = express.Router();

export const getLeague = async (req, res) => {
  try {
    const { id } = req.params;
    const league = await League.findById(id)
      .populate("sport")
      .populate("org")
      .populate({
        path: "divisions",
        populate: {
          path: "teams",
          populate: {
            path: "wins losses",
          },
        },
      })
      .lean();
    const teamsArray = [];
    for (let division of league.divisions) {
      for (let team of division.teams) {
        console.log(team);
        teamsArray.push(team);
      }
    }
    teamsArray.sort((a, b) =>
      (a.wins * 1.0) / (a.wins + a.losses) >
      (b.wins * 1.0) / (b.wins + b.losses)
        ? -1
        : 1
    );
    league.teams = teamsArray;

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

    const newLeague = new League({ sport, games, teams, org }).populate(
      "sport"
    );

    await newLeague.save();

    res.status(201).json(newLeague);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
