import mongoose from "mongoose";
const Schema = mongoose.Schema;

const sportSchema = Schema({
  description: String,
  rulesURL: String,
  image: String,
  org: { type: Schema.Types.ObjectId, ref: "Org" },
  leagues: [{ type: Schema.Types.ObjectId, ref: "League" }],
  quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },
});

var Sport = mongoose.model("Sport", sportSchema);

export default Sport;
