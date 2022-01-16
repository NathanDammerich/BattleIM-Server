import express from "express";

import Admin from "../models/Admin.js";

const router = express.Router();

export const getAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id).populate("org");
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
