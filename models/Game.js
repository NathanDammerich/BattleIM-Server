import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gameSchema = Schema({
  homeTeam: { type: Schema.Types.ObjectId, ref: "Team" },
  opponent: { type: Schema.Types.ObjectId, ref: "Team" },
  league: { type: Schema.Types.ObjectId, ref: "League" },
  location: String,
  date: String,
  time: String,
  results: {
    winner: { type: Schema.Types.ObjectId, ref: "Team" },
    loser: { type: Schema.Types.ObjectId, ref: "Team" },
    homeScore: Number,
    awayScore: Number,
  },
});

var Game = mongoose.model("Game", gameSchema);

export default Game;
