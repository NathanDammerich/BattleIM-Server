import mongoose from "mongoose";
const Schema = mongoose.Schema;

const teamSchema = Schema({
  name: String,
  wins: Number,
  losses: Number,
  leagueName: String,
  league: { type: Schema.Types.ObjectId, ref: "League" },
  division: { type: Schema.Types.ObjectId, ref: "Division" },
  sport: { type: Schema.Types.ObjectId, ref: "Sport" },
  games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  players: [{ type: Schema.Types.ObjectId, ref: "User" }],
  invites: [{ type: Schema.Types.ObjectId, ref: "User" }],
  captain: { type: Schema.Types.ObjectId, ref: "User" },
  org: { type: Schema.Types.ObjectId, ref: "Org" },
});

var Team = mongoose.model("Team", teamSchema);

export default Team;
