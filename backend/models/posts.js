const mongoose = require("mongoose");

const { Schema } = mongoose;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  body: { type: String, required: true },
  time: { type: Number, required: true },
  poster: { type: String, required: true, maxLength: 100 },
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});
module.exports = mongoose.model("Posts", PostSchema, "Posts");
