import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gameSchema = Schema({
  homeTeam: { type: Schema.Types.ObjectId, ref: "Team" },
  awayTeam: { type: Schema.Types.ObjectId, ref: "Team" },
  leagueID: { type: Schema.Types.ObjectId, ref: "League" },
  league: String,
  location: String,
  date: { type: Schema.Types.Date },
  results: {
    winningTeam: { type: Schema.Types.ObjectId, ref: "Team" },
    losingTeam: { type: Schema.Types.ObjectId, ref: "Team" },
    winningScore: Number,
    losingScore: Number,
  },
  homeAttendance: [{ type: Schema.Types.ObjectId, ref: "User" }],
  awayAttendance: [{ type: Schema.Types.ObjectId, ref: "User" }],
  division: { type: Schema.Types.ObjectId, ref: "Division" },
});

var Game = mongoose.model("Game", gameSchema);

export default Game;
