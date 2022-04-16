const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, select: false },
  firstname: { type: String, required: true, maxLength: 100 },
  lastname: { type: String, required: true, maxLength: 100 },
  role: { type: String, required: true, enum: ["PT", "Patient"] },
  registerTime: { type: String, required: true, select: false },
  unsuccessfulAttempts: { type: Number, default: 0, select: false },
  timeOut: { type: Number, default: 0, select: false },
});
module.exports = mongoose.model("Users", UserSchema, "Users");
