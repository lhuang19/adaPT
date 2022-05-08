const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");
const router = require("../routes/exercise.routes");
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
      { path: "/feed/:username", method: "get" },
      { path: "/", method: "post" },
      { path: "/", method: "delete" },
      { path: "/counter", method: "put" },
    ];

    routes.forEach((route) => {
      const match = router.stack.find(
        (s) => s.route.path === route.path && s.route.methods[route.method]
      );
      expect(match).toBeTruthy();
    });
  });

  test("GET /feed/:username endpoint status code and response 404", async () =>
    request(app).get("/feed/").expect(404));
  test("GET /feed/:username endpoint status code and response 500", async () =>
    request(app).get("/feed/tester").expect(500));
  test("GET /feed/:username endpoint status code and response 200", async () => {
    await createUser();
    await request(app).get("/feed/tester").expect(200);
    await createUser("tester2", "Patient");
    return request(app).get("/feed/tester2").expect(200);
  });

  test("POST / endpoint status code and response 500", async () =>
    request(app).post("/").send({}).expect(500));
  test("DELETE / endpoint status code and response 500", async () =>
    request(app).delete("/").send({}).expect(500));
  test("POST / endpoint status code and response 500 not found", async () => {
    await createUser();
    await request(app)
      .post("/")
      .send({
        pt: "tester",
        patient: "tester2",
        name: "Good exercise",
        sets: 2,
        reps: 10,
        instructions: "Squats",
        setsCompleted: 0,
        creationTime: 121,
      })
      .expect(500);
  });
  test("POST DELETE /  POST /counter endpoint status code and response 201", async () => {
    await createUser();
    await createUser("tester2");
    const result = await request(app)
      .post("/")
      .send({
        pt: "tester",
        patient: "tester2",
        name: "Good exercise",
        sets: 2,
        reps: 10,
        instructions: "Squats",
        setsCompleted: 0,
        creationTime: 121,
      })
      .expect(201)
      .then((response) => JSON.parse(response.text).data);
    await request(app)
      .put("/counter")
      .send({ patient: result.patient, creationTime: 121, setsCompleted: 1 })
      .expect(201);
    return request(app)
      .delete("/")
      .send({
        pt: result.pt,
        creationTime: 121,
      })
      .expect(200);
  });

  test("PUT /counter endpoint status code and response 500", async () =>
    request(app).put("/counter").send({}).expect(500));

  test("PUT /counter endpoint status code and response 500 second", async () =>
    request(app)
      .put("/counter")
      .send({ patient: "tester", creationTime: 1, setsCompleted: 1 })
      .expect(500));

  // test("DELETE / endpoint status code and response 500", async () =>
  //   request(app).delete("/").send({}).expect(500));
  // test("DELETE /  endpoint status code and response 200", async () => {
  //   const response = await createUser();
  //   await createPost(response._id, "tester", 1);
  //   return request(app)
  //     .delete("/")
  //     .send({
  //       poster: "tester",
  //       time: 1,
  //     })
  //     .expect(200);
  // });

  // test("GET /:id/reactions/:username endpoint status code and response 404", async () =>
  //   request(app).get("//reactions/").send({}).expect(404));
  // test("GET /:id/reactions/:username  endpoint status code and response 200", async () => {
  //   const response = await createUser();
  //   const post = await createPost(response._id, "tester", 1);
  //   return request(app)
  //     .get(`/${getPostid(post)}/reactions/tester`)
  //     .expect(200);
  // });

  // test("POST /reactions endpoint status code and response 500", async () =>
  //   request(app).post("/reactions").send({}).expect(500));
  // test("POST /reactions  endpoint status code and response 201", async () =>
  //   request(app)
  //     .post("/reactions")
  //     .send({
  //       postid: "something",
  //       poster: "something",
  //       username: "something",
  //       time: 1,
  //       type: "something",
  //     })
  //     .expect(201));

  // test("DELETE /:id/reactions/:username/:type endpoint status code and response 404", async () =>
  //   request(app).delete("//reactions//").send({}).expect(404));
  // test("DELETE /:id/reactions/:username/:type  endpoint status code and response 200", async () => {
  //   const response = await createUser();
  //   const post = await createPost(response._id, "tester", 1);
  //   createReaction("tester", 1, "like", "tester");
  //   return request(app)
  //     .delete(`/${getPostid(post)}/reactions/tester/like`)
  //     .expect(200);
  // });

  // test("GET /:id/comments endpoint status code and response 404", async () =>
  //   request(app).get("//comments").send({}).expect(404));
  // test("GET /:id/comments  endpoint status code and response 200", async () => {
  //   const response = await createUser();
  //   const post = await createPost(response._id, "tester", 1);
  //   return request(app)
  //     .get(`/${getPostid(post)}/comments`)
  //     .expect(200);
  // });

  // test("POST /:id/comments endpoint status code and response 500", async () =>
  //   request(app).post("/a/comments").send({}).expect(500));
  // test("POST /:id/comments  endpoint status code and response 201", async () => {
  //   const response = await createUser();
  //   const post = await createPost(response._id, "tester", 1);
  //   return request(app)
  //     .post(`/${getPostid(post)}/comments`)
  //     .send({
  //       postId: getPostid(post),
  //       commenter: "tester",
  //       content: "nice post",
  //       commentTime: 1,
  //     })
  //     .expect(201);
  // });
});
