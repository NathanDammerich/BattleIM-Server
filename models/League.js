import mongoose from "mongoose";
const Schema = mongoose.Schema;

const leagueSchema = Schema({
  name: String,
  sport: { type: Schema.Types.ObjectId, ref: "Sport" },
  divisions: [{ type: Schema.Types.ObjectId, ref: "Division" }],
  org: { type: Schema.Types.ObjectId, ref: "Org" },
});

var League = mongoose.model("League", leagueSchema);

export default League;
