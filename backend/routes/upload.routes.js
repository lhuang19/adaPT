const router = require("express").Router();
const Multer = require("multer");
const lib = require("../controllers/upload.controllers");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});
router.post("/", multer.single("file"), lib.upload);
router.delete("/:filename", async (req, res) => {
  try {
    await lib.deleteFile(req.params.filename);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

router.get("/:filename", async (req, res) => {
  try {
    await lib.getFile(req.params.filename);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

module.exports = router;
