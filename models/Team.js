import mongoose from "mongoose";
const Schema = mongoose.Schema;

const teamSchema = Schema({
  name: String,
  wins: Number,
  losses: Number,
  league: { type: Schema.Types.ObjectId, ref: "League" },
  games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  players: [{ type: Schema.Types.ObjectId, ref: "User" }],
  org: { type: Schema.Types.ObjectId, ref: "Org" },
});

var Team = mongoose.model("Team", teamSchema);

export default Team;
