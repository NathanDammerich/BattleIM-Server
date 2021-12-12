import mongoose from "mongoose";
const Schema = mongoose.Schema;

const orgSchema = Schema({
  description: String,
  sports: [{ type: Schema.Types.ObjectId, ref: "Sport" }],
});

var Org = mongoose.model("Org", orgSchema);

export default Org;
