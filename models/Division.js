import mongoose from "mongoose";
const Schema = mongoose.Schema;

const divisionSchema = Schema({
  timeSlot: {
    day: [String],
    timeStart: [{ type: Schema.Types.Date }],
    timeEnd: [{ type: Schema.Types.Date }],
  },
  status: String,
  league: { type: Schema.Types.ObjectId, ref: "League" },
  maxTeams: Number,
  games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
});

var Division = mongoose.model("Division", divisionSchema);

export default Division;
