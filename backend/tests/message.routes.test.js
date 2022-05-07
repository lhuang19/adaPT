const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");

const router = require("../routes/message.routes");

const { connectToDB, disconnectDB, sleep, createUser } = require("./utils");
const Users = require("../models/user");
const Messages = require("../models/messages");

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
  if (await Messages.findOne({})) {
    await Messages.deleteMany({});
  }
  await createUser();
  await createUser("tester2");
  await sleep(20);
});

describe("/ endpoint tests", () => {
  test("has routes", () => {
    const routes = [
      { path: "/", method: "post" },
      { path: "/:username", method: "get" },
    ];

    routes.forEach((route) => {
      const match = router.stack.find(
        (s) => s.route.path === route.path && s.route.methods[route.method]
      );
      expect(match).toBeTruthy();
    });
  });

  test("GET /:username endpoint status code and response 404", async () =>
    request(app).get("/somerando").expect(404));

  test("POST / endpoint status code and response 500", async () =>
    request(app).post("/").send({}).expect(500));

  test("POST / GET /:username endpoint status code and response 201 and 200", async () => {
    await request(app)
      .post("/")
      .send({
        body: "my message",
        time: 1,
        sender: "tester",
        receiver: "tester2",
        senderFirstname: "first",
      })
      .expect(201)
      .then((response) =>
        expect(JSON.parse(response.text).data).toMatchObject({
          body: "my message",
          time: 1,
          sender: "tester",
          receiver: "tester2",
          senderFirstname: "first",
        })
      );
    await request(app)
      .post("/")
      .send({
        body: "my second message",
        time: 2,
        sender: "tester2",
        receiver: "tester",
        senderFirstname: "first",
      })
      .expect(201)
      .then((response) =>
        expect(JSON.parse(response.text).data).toMatchObject({
          body: "my second message",
          time: 2,
          sender: "tester2",
          receiver: "tester",
          senderFirstname: "first",
        })
      );
    return request(app)
      .get("/tester")
      .expect(200)
      .then((response) =>
        expect(JSON.parse(response.text).data).toMatchObject([
          {
            body: "my message",
            time: 1,
            sender: "tester",
            receiver: "tester2",
            senderFirstname: "first",
          },
          {
            body: "my second message",
            time: 2,
            sender: "tester2",
            receiver: "tester",
            senderFirstname: "first",
          },
        ])
      );
  });
});
