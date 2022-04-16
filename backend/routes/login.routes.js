const router = require("express").Router();
const lib = require("../controllers/login.controllers");

router.post("/", async (req, res) => {
  try {
    const results = await lib.login(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/returning", async (req, res) => {
  try {
    const results = await lib.returning(req.body.token);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const results = await lib.signup(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
