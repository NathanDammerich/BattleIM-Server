import express from "express";

import Game from "../models/Game.js";
import Team from "../models/Team.js";

const router = express.Router();

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthOfYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayToString = (date) => {
  return `${daysOfWeek[date.getDay()]} ${
    monthOfYear[date.getMonth()]
  } ${date.getDate()}`;
};

const timeToString = (date) => {
  let amPm = "PM";
  let hour = date.getHours();
  if (hour < 12) {
    amPm = "AM";
  } else if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour = hour - 12;
  }
  let minutes = "";
  const minFunc = date.getMinutes();
  if (minFunc < 10) {
    minutes = `0${minFunc}`;
  } else {
    minutes = minFunc;
  }
  return `${hour}:${minutes} ${amPm}`;
};

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
      .populate("awayTeam")
      .lean();

    game.day = dayToString(game.date);
    game.time = timeToString(game.date);

    res.status(200).json(game);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const postResultsOfGame = async (req, res) => {
  console.log("postResultsOfGame called");
  try {
    const { id } = req.params;
    const { results } = req.body;
    if (
      !results.hasOwnProperty("winningTeam") ||
      !results.hasOwnProperty("losingTeam") ||
      !results.hasOwnProperty("winningScore") ||
      !results.hasOwnProperty("losingScore")
    ) {
      return res
        .status(400)
        .json({ message: "Check format of results object" });
    }
    let game = await Game.findById(id).lean();
    game.results = { ...results };
    const updatedGame = await Game.findByIdAndUpdate(id, game, { new: true });
    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      homeTeam,
      awayTeam,
      homeAttendance,
      awayAttendance,
      league,
      location,
      date,
      time,
      results,
    } = req.body;

    const updatedGame = {
      homeTeam,
      awayTeam,
      homeAttendance,
      awayAttendance,
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
      .populate("awayTeam");

    res.status(200).json(updatedGameMongoose);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const createGame = async (req, res) => {
  try {
    const {
      homeTeam,
      awayTeam,
      homeAttendance,
      awayAttendance,
      league,
      location,
      date,
      time,
      results,
    } = req.body;

    const newGame = new Game({
      homeTeam,
      awayTeam,
      homeAttendance,
      awayAttendance,
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

export const getUpcomingGames = async (req, res) => {
  const { teamsArray } = req.body;
  console.log(teamsArray);
  try {
    const gamesArray = [];
    const popTeam = await Team.find({
      _id: { $in: teamsArray },
    })
      .populate({
        path: "games",
        populate: {
          path: "awayTeam homeTeam",
        },
      })
      .lean();

    for (let team of popTeam) {
      for (let game of team.games) {
        gamesArray.push(game);
      }
    }

    const currentDate = new Date();
    const upcomingGames = gamesArray.filter((game) => game.date > currentDate);

    let sortedGames = upcomingGames.sort((a, b) => a.date - b.date);

    for (let game of sortedGames) {
      const day = dayToString(game.date);
      const time = timeToString(game.date);
      game.day = day;
      game.time = time;
    }

    res.status(200).json(sortedGames);
  } catch (error) {
    res.status(404);
  }
};

export default router;
