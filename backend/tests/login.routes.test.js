const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");
const lib = require("../controllers/login.controllers");
const router = require("../routes/login.routes");
const Users = require("../models/user");
const { connectToDB, disconnectDB, createUser, sleep } = require("./utils");

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
    Users.deleteMany({}, () => {});
  }
  await sleep(20);
});

describe("/ endpoint tests", () => {
  test("has routes", () => {
    const routes = [
      { path: "/", method: "post" },
      { path: "/returning/:token", method: "get" },
      { path: "/signup", method: "post" },
    ];

    routes.forEach((route) => {
      const match = router.stack.find(
        (s) => s.route.path === route.path && s.route.methods[route.method]
      );
      expect(match).toBeTruthy();
    });
  });

  test("POST / endpoint status code and response 404", async () =>
    request(app).post("/").send({}).expect(404));
  test("POST / endpoint status code and response 201", async () => {
    await createUser();
    return request(app)
      .post("/")
      .send({ username: "tester", password: "some password" })
      .expect(201);
  });
  test("GET /returning/:token endpoint status code and response 404", async () =>
    request(app).get("/returning/:token").send({}).expect(404));
  test("GET /returning/:token endpoint status code and response 201", async () => {
    await createUser();
    const response = await lib.login({
      username: "tester",
      password: "some password",
    });
    return request(app).get(`/returning/${response.token}`).expect(200);
  });
  test("POST /signup endpoint status code and response 500", async () =>
    request(app).post("/signup").send({}).expect(500));
  test("POST /signup endpoint status code and response 201", async () =>
    request(app)
      .post("/signup")
      .send({
        username: "tester",
        firstname: "first",
        lastname: "last",
        role: "PT",
        password: "some password",
        registerTime: new Date().toLocaleString(),
        friends: [],
        friendRequests: [],
      })
      .expect(201));
});
