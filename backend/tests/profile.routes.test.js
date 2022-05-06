const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");

const router = require("../routes/profile.routes");

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
  await createUser();
  await createUser("tester2");
  await sleep(20);
});

describe("/ endpoint tests", () => {
  test("has routes", () => {
    const routes = [
      { path: "/:username1/:username2", method: "get" },
      { path: "/friendRequest/:username1/:username2", method: "post" },
      { path: "/friendRequest/:username1/:username2", method: "delete" },
      { path: "/friend/:username1/:username2", method: "post" },
      { path: "/friend/:username1/:username2", method: "delete" },
      { path: "/delete/:user", method: "delete" },
      { path: "/update", method: "post" },
      { path: "/authenticate/:username/:password", method: "get" },
      { path: "/token/:username", method: "post" },
    ];

    routes.forEach((route) => {
      const match = router.stack.find(
        (s) => s.route.path === route.path && s.route.methods[route.method]
      );
      expect(match).toBeTruthy();
    });
  });

  test("GET /:username1/:username2 endpoint status code and response 404", async () =>
    request(app).get("/tester/somerando").expect(404));
  test("GET /:username1/:username2 endpoint status code and response 200", async () =>
    request(app)
      .get("/tester/tester2")
      .expect(200)
      .then((response) => expect(JSON.parse(response.text).data).toBe(-1)));

  test("POST /friendRequest/:username1/:username2 endpoint status code and response 500", async () =>
    request(app).post("/friendRequest/tester/somerando").expect(500));
  test("POST /friendRequest/:username1/:username2 endpoint status code and response 201", async () =>
    request(app)
      .post("/friendRequest/tester/tester2")
      .expect(201)
      .then((response) => expect(JSON.parse(response.text).data).toBe(1)));

  test("DELETE /friendRequest/:username1/:username2 endpoint status code and response 500", async () =>
    request(app).delete("/friendRequest/tester/somerando").expect(500));
  test("DELETE /friendRequest/:username1/:username2 endpoint status code and response 200", async () =>
    request(app).delete("/friendRequest/tester/tester2").expect(200));

  test("POST /friend/:username1/:username2 endpoint status code and response 500", async () =>
    request(app).post("/friend/tester/somerando").expect(500));

  test("DELETE /friend/:username1/:username2 endpoint status code and response 500", async () =>
    request(app).delete("/friend/tester/somerando").expect(500));

  test("POST AND DELETE /friend/:username1/:username2 endpoint status code and response", async () => {
    await request(app).post("/friend/tester/tester2").expect(201);
    expect((await Users.findOne({ username: "tester" })).friends[0]).toBe(
      "tester2"
    );
    await request(app).delete("/friend/tester/tester2").expect(200);
    expect((await Users.findOne({ username: "tester" })).friends.length).toBe(
      0
    );
  });

  test("DELETE /delete/:user endpoint status code and response 500", async () =>
    request(app).delete("/delete/somerando").expect(500));

  test("DELETE /delete/:user endpoint status code and response 200", async () =>
    request(app).delete("/delete/tester").expect(200));

  test("POST /update endpoint status code and response 500", async () =>
    request(app).post("/update").expect(500));
  test("POST /update endpoint status code and response 201", async () =>
    request(app)
      .post("/update")
      .send({
        username: "tester",
        firstname: "new first",
        lastname: "new lastlast",
      })
      .expect(201));

  test("GET /authenticate/:username/:password endpoint status code and response 500", async () =>
    request(app).get("/authenticate/baduser/badpassword").expect(500));

  test("GET /authenticate/:username/:password endpoint status code and response 200 false", async () =>
    request(app)
      .get("/authenticate/tester/bad password")
      .expect(200)
      .then((response) => expect(JSON.parse(response.text).data).toBe(false)));
  test("GET /authenticate/:username/:password endpoint status code and response 200 true", async () =>
    request(app)
      .get("/authenticate/tester/some password")
      .expect(200)
      .then((response) => expect(JSON.parse(response.text).data).toBe(true)));

  test("POST /token/:username endpoint status code and response 500", async () =>
    request(app).post("/token/tester").expect(500));
  test("POST /token/:username endpoint status code and response 200", async () =>
    request(app)
      .post("/token/tester")
      .send({ firstname: "some first", lastname: "some last" })
      .expect(200));
});
