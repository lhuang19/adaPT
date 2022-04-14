const router = require("express").Router();
const lib = require("../controllers/login.controllers");

router.post("/", async (req, res) => {
  try {
    const results = await lib.login(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "login failed" });
  }
});

router.post("/returning", async (req, res) => {
  try {
    const results = await lib.returning(req.body.token);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "jwt invalid" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const results = await lib.signup(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "signup failed" });
  }
});

module.exports = router;
