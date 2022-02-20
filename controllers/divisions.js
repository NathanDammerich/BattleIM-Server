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

const makeDivisionObject = (division) => {
  const {
    timeSlot = [],
    league,
    maxTeams = 2,
    teams = [],
    games = [],
    status = "",
  } = division;
  return {
    timeSlot,
    league,
    maxTeams,
    teams,
    games,
    status,
  };
};

export const createDivision = async (req, res) => {
  try {
    const newDivision = new Division({
      ...makeDivisionObject(req.body),
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
export const updateDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGame = {
      ...makeDivisionObject(req.body),
      _id: id,
    };

    const updatedDivisionMongoose = await Division.findByIdAndUpdate(
      id,
      updatedGame,
      {
        new: true,
      }
    );

    res.status(200).json(updatedDivisionMongoose);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
