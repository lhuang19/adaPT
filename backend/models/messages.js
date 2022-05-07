const mongoose = require("mongoose");

const { Schema } = mongoose;

/**
 * @openapi
 * components:
 *    schemas:
 *      message:
 *        type: object
 *        required:
 *          - body
 *          - time
 *          - sender
 *          - receiver
 *          - senderFirstname
 *        properties:
 *          body:
 *            type: string
 *            example: my message
 *          time:
 *            type: number
 *            example: 1
 *          sender:
 *            type: string
 *            example: TonyPT
 *          receiver:
 *            type: string
 *            example: OtherPT
 *          senderFirstname:
 *            type: number
 *            example: Tony
 *
 */
const MessageSchema = new Schema({
  body: { type: String, required: true },
  time: { type: Number, required: true },
  sender: { type: String, required: true, maxLength: 100 },
  receiver: { type: String, required: true, maxLength: 100 },
  senderFirstname: { type: String, required: true, maxLength: 100 },
});
module.exports = mongoose.model("Messages", MessageSchema, "Messages");
