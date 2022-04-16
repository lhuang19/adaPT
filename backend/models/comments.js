const mongoose = require("mongoose");

const { Schema } = mongoose;

const CommentSchema = new Schema({
  postId: { type: String, required: true, maxLength: 100 },
  commenter: { type: String, required: true, maxLength: 100 },
  content: { type: String, required: true },
  commentTime: { type: Number },
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});
module.exports = mongoose.model("Comments", CommentSchema, "Comments");
