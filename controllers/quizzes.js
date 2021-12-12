import express, { Router } from "express";

import Quiz from "../models/Quiz.js";

const router = express.Router();

export const getQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate("sport");
    res.status(200).json(quiz);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createQuiz = async (req, res) => {
  try {
    const { minimumScore, sport, rules, questions } = req.body;
    console.log(req.body);

    const newQuiz = new Quiz({ minimumScore, sport, rules, questions });

    await newQuiz.save();

    res.status(200).json(newQuiz);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
