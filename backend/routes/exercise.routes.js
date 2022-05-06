const router = require("express").Router();
const lib = require("../controllers/exercise.controllers");

/**
 * @openapi
 * tags:
 *  - name: exercise
 *    description: endpoints related to exercises
 */

/**
 * @openapi
 * /exercise/feed:
 *  post:
 *    tags:
 *      - exercise
 *    summary: Gets exercises
 *    description: Gets exercise feed
 *    responses:
 *      200:
 *        description: exercise list
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: "#/components/schemas/exercise"
 *      500:
 *        description: server error
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *      description: username
 */
router.post("/feed", async (req, res) => {
  try {
    const results = await lib.getExercises(req.body);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /exercise/:
 *  post:
 *    tags:
 *      - exercise
 *    summary: Creates exercises
 *    description: Creates a exercise resource
 *    responses:
 *      201:
 *        description: creates exercise
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/exercise"
 *      500:
 *        description: server error
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *             $ref: "#/components/schemas/exercise"
 *      description: exercise data
 */
router.post("/", async (req, res) => {
  try {
    const results = await lib.assignExercise(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /exercise/:
 *  delete:
 *    tags:
 *      - exercise
 *    summary: Delete exercise
 *    description: Deletes a exercise resource
 *    responses:
 *      200:
 *        description: ok
 *      500:
 *        description: server error
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              pt:
 *                type: string
 *              creationTime:
 *                type: number
 *      description: post data
 */
router.delete("/", async (req, res) => {
  try {
    const results = await lib.deleteExercise(req.body);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /exercise/counter:
 *  post:
 *    tags:
 *      - exercise
 *    summary: Updates counter
 *    description: Updates sets completed a exercise
 *    responses:
 *      201:
 *        description: ok
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/exercise"
 *      500:
 *        description: server error
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              patient:
 *                type: string
 *              creationTime:
 *                type: number
 *              setsCompleted:
 *                type: number
 *      description: post data
 */
router.post("/counter", async (req, res) => {
  try {
    const results = await lib.setSetsCompleted(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

module.exports = router;
