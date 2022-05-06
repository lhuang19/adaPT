const router = require("express").Router();
const lib = require("../controllers/profile.controllers");

/**
 * @openapi
 * tags:
 *  - name: profile
 *    description: endpoints related to profile and friends
 */

/**
 * @openapi
 * /profile/{username1}/{username2}:
 *  get:
 *    tags:
 *      - profile
 *    summary: Get friend status
 *    description: Gets friend status between two usernames
 *    parameters:
 *      - name: username1
 *        in: path
 *        description: user's username
 *        required: true
 *        schema:
 *          type: string
 *      - name: username2
 *        in: path
 *        description: other username
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: friend status
 *        content:
 *          application/json:
 *            schema:
 *              status:
 *                type: number
 *      404:
 *        description: bad input parameter
 */
router.get("/:username1/:username2", async (req, res) => {
  try {
    const results = await lib.getFriendStatus(
      req.params.username1,
      req.params.username2
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /profile/friendRequest/{username1}/{username2}:
 *  post:
 *    tags:
 *      - profile
 *    summary: Create friend request
 *    description: Create friend request between two usernames
 *    parameters:
 *      - name: username1
 *        in: path
 *        description: user's username
 *        required: true
 *        schema:
 *          type: string
 *      - name: username2
 *        in: path
 *        description: other username
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      201:
 *        description: friend request status
 *        content:
 *          application/json:
 *            schema:
 *              type: number
 *      500:
 *        description: something went wrong
 */
router.post("/friendRequest/:username1/:username2", async (req, res) => {
  try {
    const results = await lib.addFriendRequest(
      req.params.username1,
      req.params.username2
    );
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /profile/friendRequest/{username1}/{username2}:
 *  delete:
 *    tags:
 *      - profile
 *    summary: Delete friend request
 *    description: Delete friend request between two usernames
 *    parameters:
 *      - name: username1
 *        in: path
 *        description: user's username
 *        required: true
 *        schema:
 *          type: string
 *      - name: username2
 *        in: path
 *        description: other username
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: ok
 *      500:
 *        description: something went wrong
 */
router.delete("/friendRequest/:username1/:username2", async (req, res) => {
  try {
    const results = await lib.deleteFriendRequest(
      req.params.username1,
      req.params.username2
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /profile/friend/{username1}/{username2}:
 *  post:
 *    tags:
 *      - profile
 *    summary: Post friends
 *    description: Posts friends between two usernames
 *    parameters:
 *      - name: username1
 *        in: path
 *        description: user's username
 *        required: true
 *        schema:
 *          type: string
 *      - name: username2
 *        in: path
 *        description: other username
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      201:
 *        description: ok
 *      500:
 *        description: something went wrong
 */
router.post("/friend/:username1/:username2", async (req, res) => {
  try {
    const result = await lib.addFriend(
      req.params.username1,
      req.params.username2
    );
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /profile/friend/{username1}/{username2}:
 *  delete:
 *    tags:
 *      - profile
 *    summary: Delete friend
 *    description: Delete friendship between two usernames
 *    parameters:
 *      - name: username1
 *        in: path
 *        description: user's username
 *        required: true
 *        schema:
 *          type: string
 *      - name: username2
 *        in: path
 *        description: other username
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: ok
 *      500:
 *        description: something went wrong
 */
router.delete("/friend/:username1/:username2", async (req, res) => {
  try {
    const results = await lib.deleteFriend(
      req.params.username1,
      req.params.username2
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /profile/delete/{user}:
 *  delete:
 *    tags:
 *      - profile
 *    summary: Delete user
 *    description: Deletes user
 *    responses:
 *      200:
 *        description: ok
 *      500:
 *        description: something went wrong
 */
router.delete("/delete/:user", async (req, res) => {
  try {
    const result = await lib.deleteProfile(req.params.user);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /profile/update:
 *  post:
 *    tags:
 *      - profile
 *    summary: Update user
 *    description: Updates user information
 *    responses:
 *      200:
 *        description: ok
 *      404:
 *        description: bad input
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/user"
 *          description: new user information
 */
router.post("/update", async (req, res) => {
  try {
    const result = await lib.updateProfile(req.body);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /profile/authenticate/{username}/{password}:
 *  get:
 *    tags:
 *      - profile
 *    summary: Authenticate user
 *    description: Check is username and password are correct
 *    parameters:
 *      - name: username
 *        in: path
 *        description: username
 *        required: true
 *        schema:
 *          type: string
 *      - name: password
 *        in: path
 *        description: password
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: ok
 *        content:
 *          application/json:
 *            schema:
 *              type: boolean
 *      500:
 *        description: something went wrong
 */
router.get("/authenticate/:username/:password", async (req, res) => {
  try {
    const result = await lib.authenticateUser(
      req.params.username,
      req.params.password
    );
    if (result) res.status(200).json({ data: true });
    else res.status(200).json({ data: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /profile/token/{username}:
 *  post:
 *    tags:
 *      - profile
 *    summary: Create token
 *    description: Create new token after update
 *    parameters:
 *      - name: username
 *        in: path
 *        description: username
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: ok. JWT token
 *        content:
 *          application/json:
 *            schema:
 *              type: string
 *      500:
 *        description: something went wrong
 */
router.post("/token/:username", async (req, res) => {
  try {
    const result = await lib.updateToken(
      req.params.username,
      req.body.firstname,
      req.body.lastname
    );
    res.status(200).json({ token: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
