import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = Schema({
  name: String,
  male: Boolean,
  email: String,
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  orgs: [{ type: Schema.Types.ObjectId, ref: "Org" }],
  invites: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  quizzesPassed: [{ type: Schema.Types.ObjectId, ref: "Quiz" }],
  password: String,
});

var User = mongoose.model("User", userSchema);

export default User;
