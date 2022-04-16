const router = require("express").Router();
const lib = require("../controllers/exercise.controllers");

router.post("/feed", async (req, res) => {
  try {
    const results = await lib.getExercises(req.body);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.post("/", async (req, res) => {
  try {
    const results = await lib.assignExercise(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const results = await lib.deleteExercise(req.body);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

// TODO Add route for changing completed sets counter

module.exports = router;
