import express from "express";

import Division from "../models/Division.js";

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
    const { timeSlot, league, maxTeams } = req.body;
    const newDivision = new Division({
      timeSlot,
      league,
      maxTeams,
      teams: [],
      games: [],
      status: "",
    });
    await newDivision.save();
    res.status(200).json(newDivision);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
