import express from "express";

import Sport from "../models/Sport.js";

const router = express.Router();

export const getSport = async (req, res) => {
  try {
    const { id } = req.params;

    const sport = await Sport.findById(id);

    res.status(200).json(sport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSport = async (req, res) => {
  try {
    const { id } = req.params;

    const { description, rules, org } = req.body;

    const updatedSport = { description, rules, org, _id: id };

    await Sport.findByIdAndUpdate(id, updatedSport, { new: true });

    res.status(200).json(updatedSport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createSport = async (req, res) => {
  try {
    const { description, rules, org } = req.body;

    const newSport = new Sport({ description, rules });

    await newSport.save();

    res.status(200).json(newSport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const listSports = async (_req, res) => {
  try {
    const sports = await Sport.find();

    res.status(200).json(sports);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
