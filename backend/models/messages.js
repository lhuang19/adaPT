const mongoose = require("mongoose");

const { Schema } = mongoose;

const MessageSchema = new Schema({
  body: { type: String, required: true },
  time: { type: Number, required: true },
  sender: { type: String, required: true, maxLength: 100 },
  receiver: { type: String, required: true, maxLength: 100 },
});
module.exports = mongoose.model("Messages", MessageSchema, "Messages");
