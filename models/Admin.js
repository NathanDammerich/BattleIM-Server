import mongoose from "mongoose";
const Schema = mongoose.Schema;

const adminSchema = Schema({
  name: String,
  org: { type: Schema.Types.ObjectId, ref: "Org" },
});

var Admin = mongoose.model("Admin", adminSchema);

export default Admin;
