const router = require("express").Router();
const lib = require("../controllers/login.controllers");

/**
 * @openapi
 * tags:
 *  - name: login
 *    description: endpoints related to login and signup
 */

/**
 * @openapi
 * /login:
 *  post:
 *    tags:
 *      - login
 *    summary: Login
 *    description: Login user and create login token
 *    responses:
 *      201:
 *        description: User information returned and token created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/user"
 *      404:
 *        description: bad input parameter
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: TonyPT
 *              password:
 *                type: string
 *                example: SecretPassword
 *      description: Username and password used to login
 */
router.post("/", async (req, res) => {
  try {
    const results = await lib.login(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
 * @openapi
 * /login/returning:
 *  get:
 *    tags:
 *      - login
 *    summary: Check login token
 *    description: Verify JWT token and return user parameters if successful
 *    parameters:
 *      - name: JWT token
 *        in: path
 *        description: JWT token with returning information
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: User information
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/user"
 *      404:
 *        description: bad input, JWT not valid
 */
router.get("/returning/:token", async (req, res) => {
  try {
    const results = await lib.returning(req.params.token);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

/**
 * @openapi
 * /login/signup:
 *  post:
 *    tags:
 *      - login
 *    summary: Signup
 *    description: Creates a new User
 *    responses:
 *      200:
 *        description: User information
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/user"
 *      404:
 *        description: bad input
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/user"
 *          description: Username and password used to login
 */
router.post("/signup", async (req, res) => {
  try {
    const results = await lib.signup(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
