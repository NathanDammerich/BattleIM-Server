import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gameSchema = Schema({
  homeTeam: { type: Schema.Types.ObjectId, ref: "Team" },
  awayTeam: { type: Schema.Types.ObjectId, ref: "Team" },
  league: { type: Schema.Types.ObjectId, ref: "League" },
  location: String,
  date: { type: Schema.Types.Date },
  results: {
    winningTeam: { type: Schema.Types.ObjectId, ref: "Team" },
    losingTeam: { type: Schema.Types.ObjectId, ref: "Team" },
    winningScore: Number,
    losingScore: Number,
  },
});

var Game = mongoose.model("Game", gameSchema);

export default Game;
