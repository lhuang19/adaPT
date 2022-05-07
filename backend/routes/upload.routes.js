const router = require("express").Router();
const Multer = require("multer");
const lib = require("../controllers/upload.controllers");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

/**
 * @openapi
 * tags:
 *  - name: upload
 *    description: endpoints related to uploading images
 */

/**
 * @openapi
 * /upload:
 *  post:
 *    tags:
 *      - upload
 *    summary: Create image
 *    description: Creates a image resource
 *    responses:
 *      201:
 *        description: image resource
 *      404:
 *        description: bad input parameter
 *    requestBody:
 *      description: image data (multipart/form-data)
 *      content:
 *        application/json:
 *          schema:
 *            type: string
 */
router.post("/", multer.single("file"), lib.upload);

/**
 * @openapi
 * /upload/{filename}:
 *  delete:
 *    tags:
 *      - upload
 *    summary: Delete image
 *    description: Delete image with filename
 *    parameters:
 *      - name: filename
 *        in: path
 *        description: filename of image
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: ok
 *      404:
 *        description: bad input parameter
 */
router.delete("/:filename", async (req, res) => {
  try {
    await lib.deleteFile(req.params.filename);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "try again later" });
  }
});

// /**
//  * @openapi
//  * /upload/{filename}:
//  *  get:
//  *    tags:
//  *      - upload
//  *    summary: Get image
//  *    description: Get image with filename
//  *    parameters:
//  *      - name: filename
//  *        in: path
//  *        description: filename of image
//  *        required: true
//  *        schema:
//  *          type: string
//  *    responses:
//  *      200:
//  *        description: image data
//  *      404:
//  *        description: bad input parameter
//  */
// router.get("/:filename", async (req, res) => {
//   try {
//     const result = await lib.getFile(req.params.filename);
//     console.log(result);
//     res.status(200).json({ success: true });
//   } catch (err) {
//     res.status(404).json({ error: "try again later" });
//   }
// });

module.exports = router;
