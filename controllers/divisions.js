import express from "express";

import Division from "../models/Division.js";
import League from "../models/League.js";

const router = express.Router();

export const getDivision = async (req, res) => {
  const { id } = req.params;

  try {
    const division = await Division.findById(id).populate({
      path: "league",
      populate: { path: "sport" },
    });
    res.status(200).json(division);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createDivision = async (req, res) => {
  try {
    const { timeSlot, league, maxTeams, status } = req.body;
    const newDivision = new Division({
      timeSlot,
      league,
      maxTeams,
      status,
      teams: [],
      games: [],
    });
    await newDivision.save();
    await League.findByIdAndUpdate(
      {
        _id: league,
      },
      {
        $addToSet: { divisions: newDivision._id },
      }
    );
    res.status(200).json(newDivision);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
