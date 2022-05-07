const mongoose = require("mongoose");

const { Schema } = mongoose;
/**
 * @openapi
 * components:
 *    schemas:
 *      reaction:
 *        type: object
 *        required:
 *          - postid
 *          - poster
 *          - username
 *          - time
 *          - type
 *        properties:
 *          postid:
 *            type: string
 *            example: TonyPT10
 *          poster:
 *            type: string
 *            example: TonyPT
 *          username:
 *            type: string
 *            example: OtherPT
 *          time:
 *            type: number
 *            example: 10
 *          type:
 *            type: string
 *            example: like
 *
 */
const ReactionSchema = new Schema({
  postid: { type: String, required: true, maxLength: 100 },
  poster: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true },
  time: { type: Number, required: true },
  type: { type: String, required: true },
});
module.exports = mongoose.model("Reactions", ReactionSchema, "Reactions");
