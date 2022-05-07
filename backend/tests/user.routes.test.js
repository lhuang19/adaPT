const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");

const router = require("../routes/user.routes");

const { connectToDB, disconnectDB, sleep, createUser } = require("./utils");
const Users = require("../models/user");

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

beforeAll(async () => {
  await connectToDB();
});
afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  if (await Users.findOne({})) {
    await Users.deleteMany({});
  }
  await sleep(20);
});

describe("/ endpoint tests", () => {
  test("has routes", () => {
    const routes = [
      { path: "/:username", method: "get" },
      { path: "/", method: "get" },
    ];

    routes.forEach((route) => {
      const match = router.stack.find(
        (s) => s.route.path === route.path && s.route.methods[route.method]
      );
      expect(match).toBeTruthy();
    });
  });

  test("GET / endpoint status code and response 404", async () =>
    request(app).get("/").expect(404));
  test("GET / endpoint status code and response 200", async () => {
    await createUser();
    return request(app)
      .get("/")
      .expect(200)
      .then((response) =>
        expect(JSON.parse(response.text).data).toMatchObject(["tester"])
      );
  });

  test("GET /:username endpoint status code and response 404", async () =>
    request(app).get("/tester").expect(404));
  test("GET /:username endpoint status code and response 200", async () => {
    await createUser("tester");
    return request(app)
      .get("/tester")
      .expect(200)
      .then((response) =>
        expect(JSON.parse(response.text).data).toMatchObject({
          username: "tester",
        })
      );
  });
});
