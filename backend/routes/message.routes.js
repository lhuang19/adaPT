const router = require("express").Router();
const lib = require("../controllers/message.controllers");

/**
 * @openapi
 * tags:
 *  - name: chat
 *    description: endpoints related to chats
 */

/**
 * @openapi
 * /chat/:
 *  post:
 *    tags:
 *      - chat
 *    summary: Create message
 *    description: Creates a message resource
 *    responses:
 *      201:
 *        description: message data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/message"
 *      500:
 *        description: server error
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *             $ref: "#/components/schemas/message"
 *      description: message data
 */

router.post("/", async (req, res) => {
  try {
    const results = await lib.postMessage(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /chat/{username}:
 *  get:
 *    tags:
 *      - chat
 *    summary: Gets chat messages
 *    description: Gets all messages to usernames
 *    parameters:
 *      - name: username
 *        in: path
 *        description: username to get messages
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Array of messages
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/message"
 *      404:
 *        description: bad input parameter
 */
router.get("/:username", async (req, res) => {
  try {
    const results = await lib.getMessages(req.params.username);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: "try again later" });
  }
});

router.get("/:currUser/:otherUser", async (req, res) => {
  try {
    const results = await lib.getCurrChatMessages(
      req.params.currUser,
      req.params.otherUser
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

module.exports = router;
