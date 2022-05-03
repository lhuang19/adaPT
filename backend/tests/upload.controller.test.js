const lib = require("../controllers/upload.controllers");

const sleep = (ms) =>
  new Promise((r) => {
    setTimeout(r, ms);
  });

beforeEach(async () => {
  await sleep(20);
});

describe("upload", () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    send: jest.fn(() => "some response"),
  };

  const req = {};
  test("params not filled", async () => {
    await expect(lib.upload(req, res)).rejects.toThrow("params not filled");
  });
  test("eh just some lines need help testing upload", async () => {
    req.file = { originalname: "some name" };
    await lib.upload(req, res);
    await new Promise(process.nextTick);
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
