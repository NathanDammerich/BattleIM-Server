import mongoose from "mongoose";
const Schema = mongoose.Schema;

const divisionSchema = Schema({
  timeSlot: String,
  status: String,
  league: { type: Schema.Types.ObjectId, ref: "League" },
  maxTeams: Number,
  games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
});

var Division = mongoose.model("Division", divisionSchema);

export default Division;
