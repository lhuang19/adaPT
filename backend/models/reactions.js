const mongoose = require("mongoose");

const { Schema } = mongoose;

const ReactionSchema = new Schema({
  postid: { type: String, required: true, maxLength: 100 },
  poster: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true },
  time: { type: Number, required: true },
  type: { type: String, required: true },
});
module.exports = mongoose.model("Reactions", ReactionSchema, "Reactions");
