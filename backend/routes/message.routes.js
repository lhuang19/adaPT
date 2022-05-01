const router = require("express").Router();
const lib = require("../controllers/message.controllers");

router.post("/", async (req, res) => {
  try {
    const results = await lib.postMessage(req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.get("/:currUser/:otherUser", async (req, res) => {
  try {
    const results = await lib.getMessages(
      req.params.currUser,
      req.params.otherUser
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

module.exports = router;
