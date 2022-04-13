const router = require("express").Router();
const lib = require("./dbOperations");

/**
 * If username is supplied, return data for one user. Otherwise, return all users.
 */
router.get("/:username", async (req, res) => {
  try {
    const results = await lib.getUserData(
      req.app.get("db"),
      req.params.username
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.get("/", async (req, res) => {
  try {
    const results = await lib.getUsers(req.app.get("db"));
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

module.exports = router;
