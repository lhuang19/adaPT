const router = require("express").Router();
const lib = require("../controllers/profile.controllers");

router.get("/:username1/:username2", async (req, res) => {
  try {
    const results = await lib.getFriendStatus(
      req.params.username1,
      req.params.username2
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.post("/friendRequest/:username1/:username2", async (req, res) => {
  try {
    const results = await lib.addFriendRequest(
      req.params.username1,
      req.params.username2
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.delete("/friendRequest/:username1/:username2", async (req, res) => {
  try {
    const results = await lib.deleteFriendRequest(
      req.params.username1,
      req.params.username2
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.post("/friend/:username1/:username2", async (req, res) => {
  try {
    await lib.addFriend(req.params.username1, req.params.username2);
    res.status(200);
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.delete("/friend/:username1/:username2", async (req, res) => {
  try {
    const results = await lib.deleteFriend(
      req.params.username1,
      req.params.username2
    );
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.delete("/delete/:user", async (req, res) => {
  try {
    await lib.deleteProfile(req.params.user);
    res.status(200);
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.post("/update", async (req, res) => {
  try {
    await lib.updateProfile(req.body);
    res.status(200);
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.get("/authenticate/:username/:password", async (req, res) => {
  try {
    const result = await lib.authenticateUser(
      req.params.username,
      req.params.password
    );
    if (result) res.status(200).json({ data: true });
    else res.status(200).json({ data: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/token/:username", async (req, res) => {
  try {
    const result = await lib.updateToken(
      req.params.username,
      req.body.firstname,
      req.body.lastname
    );
    res.status(200).json({ token: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
