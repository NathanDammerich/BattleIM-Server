import express from "express";

import Org from "../models/Org.js";

const router = express.Router();

export const getOrg = async (req, res) => {
  try {
    const { id } = req.params;
    const org = await Org.findById(id).populate({
      path: "sports",
      populate: {
        path: "leagues",
      },
    });
    //.populate("sports.leagues");

    res.status(200).json(org);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateOrg = async (req, res) => {
  try {
    const { id } = req.params;

    const { description, leagues } = req.body;

    const updatedOrg = { description, leagues, _id: id };

    await Org.findByIdAndUpdate(id, updatedOrg, { new: true });

    res.status(200).json(updatedOrg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createOrg = async (req, res) => {
  try {
    const { description, leagues } = req.body;

    const newOrg = new Org({ description, leagues });

    await newOrg.save();

    res.status(200).json(newOrg);
  } catch (error) {
    res.status(400).json({ messsage: error.message });
  }
};

export default router;
