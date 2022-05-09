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
 * /exercise/feed/{username}:
 *  get:
 *    tags:
 *      - exercise
 *    summary: Gets exercises
 *    description: Gets exercise feed
 *    parameters:
 *      - name: username
 *        in: path
 *        description: requester's username
 *        required: true
 *        schema:
 *          type: string
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
 */
router.get("/feed/:username", async (req, res) => {
  try {
    const results = await lib.getExercises(req.params.username);
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
 * /exercise/{pt}/{creationTime}:
 *  delete:
 *    tags:
 *      - exercise
 *    summary: Delete exercise
 *    description: Deletes a exercise resource
 *    parameters:
 *      - name: pt
 *        in: path
 *        description: the pt who assigned the exercise to be deleted
 *        required: true
 *        schema:
 *          type: string
 *      - name: creationTime
 *        in: path
 *        description: creation time of exercise
 *        required: true
 *        schema:
 *          type: number
 *    responses:
 *      200:
 *        description: ok
 *      500:
 *        description: server error
 */
router.delete("/:pt/:creationTime", async (req, res) => {
  try {
    const results = await lib.deleteExercise(
      req.params.pt,
      req.params.creationTime
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

/**
 * @openapi
 * /exercise/counter:
 *  put:
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
 *      description: put data
 */
router.put("/counter", async (req, res) => {
  try {
    const results = await lib.setSetsCompleted(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

module.exports = router;
