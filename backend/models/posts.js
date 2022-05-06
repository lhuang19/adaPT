const mongoose = require("mongoose");

const { Schema } = mongoose;
/**
 * @openapi
 * components:
 *    schemas:
 *      post:
 *        type: object
 *        required:
 *          - title
 *          - body
 *          - time
 *          - poster
 *        properties:
 *          title:
 *            type: string
 *            example: my post
 *          body:
 *            type: string
 *            example: my post body
 *          time:
 *            type: number
 *            example: 1
 *          poster:
 *            type: string
 *            example: TonyPT
 *          users:
 *            type: number
 *          media:
 *            type: string
 *
 */
const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  body: { type: String, required: true },
  time: { type: Number, required: true },
  poster: { type: String, required: true, maxLength: 100 },
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  media: { type: String },
});
module.exports = mongoose.model("Posts", PostSchema, "Posts");
