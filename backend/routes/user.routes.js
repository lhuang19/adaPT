const router = require("express").Router();
const lib = require("../controllers/user.controllers");

/**
 * @openapi
 * tags:
 *  - name: user
 *    description: endpoint related to user list and data
 */

/**
 * @openapi
 * /user/{username}:
 *  get:
 *    tags:
 *      - user
 *    summary: Get user data
 *    description: Get user data by username
 *    parameters:
 *      - name: username
 *        in: path
 *        description: username
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: User information returned
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/user"
 *      404:
 *        description: bad input parameter
 */
router.get("/:username", async (req, res) => {
  try {
    const results = await lib.getUserData(req.params.username);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /user:
 *  get:
 *    tags:
 *      - user
 *    summary: Get user list
 *    description: Get usernames list
 *    responses:
 *      200:
 *        description: Usermname list
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                 type: string
 *                 example: some username
 *      404:
 *        description: bad input parameter
 */
router.get("/", async (req, res) => {
  try {
    const results = await lib.getUsers();
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: "try again later" });
  }
});

module.exports = router;
