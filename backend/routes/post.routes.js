const router = require("express").Router();
const lib = require("../controllers/post.controllers");

/**
 * @openapi
 * tags:
 *  - name: posts
 *    description: endpoints related to posts, comments, and reactions
 */

/**
 * @openapi
 * /post/feed/{username}:
 *  get:
 *    tags:
 *      - posts
 *    summary: Gets posts
 *    description: Gets post made my user
 *    parameters:
 *      - name: username
 *        in: path
 *        description: username to get posts from
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Array of posts
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/post"
 *      404:
 *        description: bad input parameter
 */
router.get("/feed/:username", async (req, res) => {
  try {
    const results = await lib.getPosts(req.params.username);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /post/feed/{username}/all:
 *  get:
 *    tags:
 *      - posts
 *    summary: Gets posts for feed
 *    description: Gets posts by user and friends
 *    parameters:
 *      - name: username
 *        in: path
 *        description: username for posts and friend's posts
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Array of posts
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/post"
 *      404:
 *        description: bad input parameter
 */
router.get("/feed/:username/all", async (req, res) => {
  try {
    const results = await lib.getPostsAll(req.params.username);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /post/:
 *  post:
 *    tags:
 *      - posts
 *    summary: Create post
 *    description: Creates a post resource
 *    responses:
 *      201:
 *        description: post data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/post"
 *      500:
 *        description: server error
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *             $ref: "#/components/schemas/post"
 *      description: post data
 */
router.post("/", async (req, res) => {
  try {
    const results = await lib.postPost(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /post/{username}/{time}:
 *  delete:
 *    tags:
 *      - posts
 *    summary: Delete post
 *    description: Deletes a post resource
 *    parameters:
 *      - name: username
 *        in: path
 *        description: poster's username
 *        required: true
 *        schema:
 *          type: string
 *      - name: time
 *        in: path
 *        description: time of post
 *        required: true
 *        schema:
 *          type: number
 *    responses:
 *      200:
 *        description: ok
 *      500:
 *        description: server error
 */
router.delete("/:username/:time", async (req, res) => {
  try {
    const results = await lib.deletePost(req.params.username, req.params.time);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /post/{id}/reactions/{username}:
 *  get:
 *    tags:
 *      - posts
 *    summary: Gets reactions
 *    description: Gets reactions count and user reactions on post
 *    parameters:
 *      - name: id
 *        in: path
 *        description: id of post
 *        required: true
 *        schema:
 *          type: string
 *      - name: username
 *        in: path
 *        description: username for reactions
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: ok
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                smileCount:
 *                  type: number
 *                  example: 10
 *                likeCount:
 *                  type: number
 *                  example: 3
 *                checkCount:
 *                  type: number
 *                  example: 6
 *                smiled:
 *                  type: boolean
 *                  example: true
 *                liked:
 *                  type: boolean
 *                  example: false
 *                checked:
 *                  type: boolean
 *                  example: false
 *      404:
 *        description: not found
 */
router.get("/:id/reactions/:username", async (req, res) => {
  try {
    const results = await lib.getReactions(req.params.id, req.params.username);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /post/reactions:
 *  post:
 *    tags:
 *      - posts
 *    summary: Create reaction
 *    description: Creates a reaction resource
 *    responses:
 *      201:
 *        description: post data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/reaction"
 *      500:
 *        description: server error
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              poster:
 *                type: string
 *              time:
 *                type: number
 *              username:
 *                type: string
 *              type:
 *                type: string
 *      description: reaction data
 */
router.post("/reactions", async (req, res) => {
  try {
    const results = await lib.postReaction(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /post/{id}/reactions/{username}/{type}:
 *  delete:
 *    tags:
 *      - posts
 *    summary: Delete reaction
 *    description: Deletes a reaction resource
 *    parameters:
 *      - name: id
 *        in: path
 *        description: id of post
 *        required: true
 *        schema:
 *          type: string
 *      - name: username
 *        in: path
 *        description: username for reactions
 *        required: true
 *        schema:
 *          type: string
 *      - name: type
 *        in: path
 *        description: reaction type
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: ok
 *      500:
 *        description: server error
 */
router.delete("/:id/reactions/:username/:type", async (req, res) => {
  try {
    const results = await lib.deleteReaction(
      req.params.id,
      req.params.username,
      req.params.type
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /post/{id}/comments:
 *  get:
 *    tags:
 *      - posts
 *    summary: Gets comments
 *    description: Gets comments for a post
 *    parameters:
 *      - name: id
 *        in: path
 *        description: post id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: comment data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/comment"
 *      404:
 *        description: bad input parameter
 */
router.get("/:id/comments", async (req, res) => {
  try {
    const results = await lib.getComments(req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /post/{id}/comments:
 *  post:
 *    tags:
 *      - posts
 *    summary: Create a comment
 *    description: Creates a comment resource
 *    parameters:
 *      - name: id
 *        in: path
 *        description: post id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      201:
 *        description: comment data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/comment"
 *      500:
 *        description: server error
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *             $ref: "#/components/schemas/comment"
 *      description: comment data
 */
router.post("/:id/comments", async (req, res) => {
  try {
    const results = await lib.postComment(req.params.id, req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

module.exports = router;
