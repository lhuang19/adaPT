const router = require("express").Router();
const lib = require("../controllers/profile.controllers");

router.get("/:username1/:username2", async (req, res) => {
  try {
    const results = await lib.friendStatus(req.params.username1, req.params.username2);
    res.status(200).json({ status: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.post("/friendRequest/:username1/:username2", async (req, res) => {
  try {
    await lib.addFriendRequest(req.params.username1, req.params.username2);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.delete("/friendRequest/:username1/:username2", async (req, res) => {
  try {
    await lib.deleteFriendRequest(req.params.username1, req.params.username2);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.post("/friend/:username1/:username2", async (req, res) => {
  try {
    await lib.addFriend(req.params.username1, req.params.username2);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.delete("/friend/:username1/:username2", async (req, res) => {
  try {
    await lib.deleteFriend(req.params.username1, req.params.username2);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

module.exports = router;
