const router = require("express").Router();
const lib = require("./dbOperations");

router.post("/", async (req, res) => {
  try {
    const results = await lib.login(req.app.get("db"), req.body);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "login failed" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const results = await lib.signup(req.app.get("db"), req.body);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "signup failed" });
  }
});

module.exports = router;
