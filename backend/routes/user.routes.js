const router = require("express").Router();
const lib = require("../controllers/user.controllers");

/**
 * If username is supplied, return data for one user. Otherwise, return all users.
 */
router.get("/:username", async (req, res) => {
  try {
    const results = await lib.getUserData(req.params.username);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.get("/", async (req, res) => {
  try {
    const results = await lib.getUsers();
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

module.exports = router;
