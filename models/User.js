import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: String,
  male: Boolean,
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  orgs: [{ type: Schema.Types.ObjectId, ref: "Org" }],
  invites: {
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  quizzesPassed: [{ type: Schema.Types.ObjectId, ref: "Quiz" }],
});

var User = mongoose.model("User", userSchema);

export default User;
