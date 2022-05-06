const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * @openapi
 * components:
 *    schemas:
 *      exercise:
 *        type: object
 *        required:
 *          - name
 *          - sets
 *          - reps
 *          - instructions
 *          - setsCompleted
 *          - creationTime
 *        properties:
 *          name:
 *            type: string
 *            example: Good exercise
 *          sets:
 *            type: number
 *            example: 2
 *          reps:
 *            type: number
 *            example: 10
 *          instructions:
 *            type: string
 *            example: Squats
 *          setsCompleted:
 *            type: number
 *            example: 0
 *          creationTime:
 *            type: number
 *            example: 121
 *
 */
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
