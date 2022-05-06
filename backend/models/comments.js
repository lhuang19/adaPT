const mongoose = require("mongoose");

const { Schema } = mongoose;
/**
 * @openapi
 * components:
 *    schemas:
 *      comment:
 *        type: object
 *        required:
 *          - postId
 *          - commenter
 *          - content
 *          - commentTime
 *        properties:
 *          postId:
 *            type: string
 *            example: TonyPT10
 *          commenter:
 *            type: string
 *            example: OtherPT
 *          content:
 *            type: string
 *            example: nice post
 *          commentTime:
 *            type: number
 *            example: 15
 *          users:
 *            type: string
 *
 */
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
