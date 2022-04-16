const mongoose = require("mongoose");

const { Schema } = mongoose;

const ExerciseSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  instructions: { type: String, required: true },
  pt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  setsCompleted: { type: Number, required: true },
  creationTime: { type: Number, required: true },
});
module.exports = mongoose.model("Exercises", ExerciseSchema, "Exercises");
