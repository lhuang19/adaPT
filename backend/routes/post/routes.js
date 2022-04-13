const router = require("express").Router();
const lib = require("./dbOperations");

router.post("/feed", async (req, res) => {
  try {
    const results = await lib.getPosts(req.app.get("db"), req.body);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.post("/", async (req, res) => {
  try {
    const results = await lib.postPost(req.app.get("db"), req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});
router.delete("/", async (req, res) => {
  try {
    const results = await lib.deletePost(req.app.get("db"), req.body);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});
router.get("/:id/reactions/:username", async (req, res) => {
  try {
    const results = await lib.getReactions(
      req.app.get("db"),
      req.params.id,
      req.params.username
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.post("/reactions", async (req, res) => {
  try {
    const results = await lib.postReaction(req.app.get("db"), req.body);
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.delete("/:id/reactions/:username/:type", async (req, res) => {
  try {
    const results = await lib.deleteReaction(
      req.app.get("db"),
      req.params.id,
      req.params.username,
      req.params.type
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const results = await lib.getComments(req.app.get("db"), req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});
router.post("/:id/comments", async (req, res) => {
  try {
    const results = await lib.postComment(
      req.app.get("db"),
      req.params.id,
      req.body
    );
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

module.exports = router;
