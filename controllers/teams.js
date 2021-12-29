import express from "express";

import Team from "../models/Team.js";
import User from "../models/User.js";

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
  return `${daysOfWeek[date.getDay()]}, ${
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

export const getTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id)
      .populate({
        path: "games",
        populate: {
          path: "awayTeam homeTeam",
        },
      })
      .populate("players")
      .populate("org")
      .populate("sport")
      .lean();

    for (let game of team.games) {
      game.day = dayToString(game.date);
      game.time = timeToString(game.date);
    }

    team.games.sort((a, b) => (a.date < b.date ? -1 : 1));

    res.status(200).json(team);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);

    const { name, games, players } = req.body;

    team.name = name;
    team.games = games;
    team.players = players;

    const updatedTeam = await Team.findByIdAndUpdate(id, team, { new: true })
      .populate("games")
      .populate("players")
      .populate("org");

    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { name, players, league, division, org, sport, leagueName, captain } =
      req.body;

    const newTeam = new Team({
      name,
      games: [],
      players,
      league,
      division,
      org,
      sport,
      wins: 0,
      losses: 0,
      leagueName,
      captain,
    });

    await newTeam.save();

    // await User.findByIdAndUpdate(
    //   { _id: players[0] },
    //   { $addToSet: { teams: newTeam._id } }
    // );

    res.status(200).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTeamsArray = async (req, res) => {
  const { teamsArray } = req.body;
  console.log("teams controller teamsArray below");
  console.log(teamsArray);
  try {
    const popTeam = await Team.find({
      _id: { $in: teamsArray },
    })
      .populate({
        path: "games",
        populate: {
          path: "awayTeam homeTeam",
        },
      })
      .populate("players")
      .populate("org")
      .populate("invites")
      .lean();

    for (let team of popTeam) {
      if (team.games.length > 1) {
        team.games = team.games.sort((a, b) => a.date - b.date);
        for (let game of team.games) {
          game.day = dayToString(game.date);
          game.time = timeToString(game.date);
        }
      }
    }

    res.status(200).json(popTeam);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const removePlayer = async (req, res) => {
  console.log("removePlayer called");
  const { playerID } = req.body;
  const { teamID } = req.params;
  try {
    console.log(teamID);
    const team = await Team.findById(teamID);

    team.players = team.players.filter(
      (player) => String(player._id) !== String(playerID)
    );

    const updatedTeam = await Team.findByIdAndUpdate(teamID, team, {
      new: true,
    });

    const user = await User.findById(playerID);

    user.teams = user.teams.filter(
      (team) => String(team._id) !== String(teamID)
    );

    const updatedUser = await User.findByIdAndUpdate(playerID, user, {
      new: true,
    });
    res.json(updatedTeam);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addInvite = async (req, res) => {
  const { id } = req.params;
  const { userID, userWhoSentInviteID } = req.body;
  try {
    const team = await Team.findById(id);
    team.invites.push(userID);
    const updatedTeam = await Team.findByIdAndUpdate(id, team, { new: true });

    const user = await User.findById(userID);
    user.invites.push({ team: id, user: userWhoSentInviteID });
    const updatedUser = await User.findByIdAndUpdate(userID, user, {
      new: true,
    });

    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export default router;
