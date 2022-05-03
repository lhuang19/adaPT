const { format } = require("util");
const { Storage } = require("@google-cloud/storage");
const dotenv = require("dotenv");

// Instantiate a storage client
dotenv.config();
const storage = new Storage();

const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
const bucket = storage.bucket(bucketName);

const upload = async (req, res) => {
  if (!req || !req.file) throw new Error("params not filled");
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on("error", (err) =>
    res.status(500).send({
      message: `Upload not successful`,
    })
  );

  blobStream.on("finish", async () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    try {
      // Make the file public
      await blob.makePublic();
      if (res === undefined) return;
      res.status(200).send({
        message: `Uploaded the file successfully: ${req.file.originalname}`,
        url: publicUrl,
      });
    } catch (e) {
      if (res === undefined) return;
      res.status(500).send({
        message: `Uploaded the file successfully: ${req.file.originalname}, but public access is denied!`,
        url: publicUrl,
      });
    }
  });
  blobStream.end(req.file.buffer);
};

const deleteFile = async (fileName) => {
  try {
    await storage.bucket(bucketName).file(fileName).delete();
  } catch (e) {
    // ehh it didnt work
  }
};

const getFile = async (fileName) => storage.bucket(bucketName).file(fileName);

module.exports = { upload, deleteFile, getFile };
