const mongoose = require("mongoose");

const { Schema } = mongoose;
/**
 * @openapi
 * components:
 *    schemas:
 *      user:
 *        type: object
 *        required:
 *          - username
 *          - password
 *          - firstname
 *          - lastname
 *          - role
 *          - registerTime
 *          - friends
 *          - friendRequests
 *        properties:
 *          username:
 *            type: string
 *            example: TonyPT
 *          password:
 *            type: string
 *            example: SomePassword
 *          firstname:
 *            type: string
 *            example: Tony
 *          lastname:
 *            type: string
 *            example: Grabiec
 *          role:
 *            type: string
 *            example: PT
 *          registerTime:
 *            type: number
 *            example: 1
 *          friends:
 *            type: array
 *            items:
 *              type: string
 *          friendRequests:
 *            type: array
 *            items:
 *              type: string
 *
 */
const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, select: false },
  firstname: { type: String, required: true, maxLength: 100 },
  lastname: { type: String, required: true, maxLength: 100 },
  role: { type: String, required: true, enum: ["PT", "Patient"] },
  registerTime: { type: String, required: true, select: false },
  unsuccessfulAttempts: { type: Number, default: 0, select: false },
  timeOut: { type: Number, default: 0, select: false },
  friends: { type: Array, required: true, default: [] },
  friendRequests: { type: Array, required: true, default: [] },
});
module.exports = mongoose.model("Users", UserSchema, "Users");
