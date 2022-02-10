import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = Schema({
  email: String,
  password: String,
  name: String,
  org: { type: Schema.Types.ObjectId, ref: "Org" },
});

var Admin = mongoose.model("Admin", adminSchema);

export default Admin;
