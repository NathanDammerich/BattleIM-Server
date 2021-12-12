import express from "express";

import Game from "../models/game.js";

const router = express.Router();

export const getGames = async (req, res) => {
  try {
    const games = await Game.find().populate("homeTeam").populate("opponent");

    res.status(200).json(games);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGame = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Game.findById(id)
      .populate("homeTeam")
      .populate("opponent");

    res.status(200).json(game);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { homeTeam, awayTeam, league, location, date, time, results } =
      req.body;

    const updatedGame = {
      homeTeam,
      awayTeam,
      league,
      location,
      date,
      time,
      results,
      _id: id,
    };

    const updatedGameMongoose = await Game.findByIdAndUpdate(id, updatedGame, {
      new: true,
    })
      .populate("homeTeam")
      .populate("opponent");

    res.status(200).json(updatedGameMongoose);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createGame = async (req, res) => {
  try {
    const { homeTeam, awayTeam, league, location, date, time, results } =
      req.body;

    const newGame = new Game({
      homeTeam,
      awayTeam,
      league,
      location,
      date,
      time,
      results,
    });

    await newGame.save();

    res.status(201).json(newGame);
  } catch (error) {
    res.status(409).json({ message: error });
  }
};

export default router;
