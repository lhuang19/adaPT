const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");
const path = require("path");

const router = require("../routes/upload.routes");

const { sleep } = require("./utils");

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

beforeEach(async () => {
  await sleep(20);
});

describe("/ endpoint tests", () => {
  test("has routes", () => {
    const routes = [
      { path: "/:filename", method: "delete" },
      { path: "/", method: "post" },
    ];

    routes.forEach((route) => {
      const match = router.stack.find(
        (s) => s.route.path === route.path && s.route.methods[route.method]
      );
      expect(match).toBeTruthy();
    });
  });

  test("POST / endpoint status code and response 500", async () =>
    request(app).post("/").send({ file: {} }).expect(500));
  test("POST / endpoint status code and response 200", async () =>
    request(app)
      .post("/")
      .attach("file", path.join(__dirname, "dummyFile.png"))
      .expect(200));

  test("DELETE /:filename endpoint status code and response 200", async () =>
    request(app).delete("/dummyFile.png").expect(200));

  test("DELETE /:filename endpoint status code and response 404", async () =>
    request(app).delete("/dummyFile.png").expect(500));
});
