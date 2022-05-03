const lib = require("../controllers/upload.controllers");

describe("upload", () => {
  test("params not filled", async () => {
    await expect(lib.upload()).rejects.toThrow("params not filled");
  });
  test("eh just some lines need help testing upload", async () => {
    await lib.upload({ file: { originalname: "some name" } });
  });
});

describe("deleteFile", () => {
  test("delete", async () => {
    await lib.deleteFile("some name");
  });
});

describe("getFile", () => {
  test("get", async () => {
    await lib.getFile("some name");
  });
});
