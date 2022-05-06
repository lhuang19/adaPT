const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");
const router = require("../routes/post.routes");
const Users = require("../models/user");
const Posts = require("../models/posts");
const Reactions = require("../models/reactions");
const Comments = require("../models/comments");

const {
  connectToDB,
  disconnectDB,
  createUser,
  createPost,
  getPostid,
  createReaction,
  sleep,
} = require("./utils");

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
  if (await Posts.findOne({})) {
    Posts.deleteMany({}, () => {});
  }
  if (await Reactions.findOne({})) {
    Reactions.deleteMany({}, () => {});
  }
  if (await Comments.findOne({})) {
    Comments.deleteMany({}, () => {});
  }
  await sleep(20);
});

describe("/ endpoint tests", () => {
  test("has routes", () => {
    const routes = [
      { path: "/feed/:username", method: "get" },
      { path: "/feed/:username/all", method: "get" },
      { path: "/", method: "post" },
      { path: "/", method: "delete" },
      { path: "/:id/reactions/:username", method: "get" },
      { path: "/reactions", method: "post" },
      { path: "/:id/reactions/:username/:type", method: "delete" },
      { path: "/:id/comments", method: "get" },
      { path: "/:id/comments", method: "post" },
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
  test("GET /feed/:username  endpoint status code and response 200", async () => {
    await createUser();
    return request(app).get("/feed/tester").expect(200);
  });

  test("GET /feed/:username/all endpoint status code and response 404", async () =>
    request(app).get("/feed//all ").expect(404));
  test("GET /feed/:username/all  endpoint status code and response 200", async () => {
    await createUser();
    return request(app).get("/feed/tester/all").expect(200);
  });

  test("POST / endpoint status code and response 500", async () =>
    request(app).post("/ ").send({}).expect(500));
  test("POST /  endpoint status code and response 200", async () => {
    await createUser();
    return request(app)
      .post("/")
      .send({
        title: "test title",
        body: "test body",
        time: 1,
        poster: "tester",
      })
      .expect(201);
  });

  test("DELETE / endpoint status code and response 500", async () =>
    request(app).delete("/").send({}).expect(500));
  test("DELETE /  endpoint status code and response 200", async () => {
    const response = await createUser();
    await createPost(response._id, "tester", 1);
    return request(app)
      .delete("/")
      .send({
        poster: "tester",
        time: 1,
      })
      .expect(200);
  });

  test("GET /:id/reactions/:username endpoint status code and response 404", async () =>
    request(app).get("//reactions/").send({}).expect(404));
  test("GET /:id/reactions/:username  endpoint status code and response 200", async () => {
    const response = await createUser();
    const post = await createPost(response._id, "tester", 1);
    return request(app)
      .get(`/${getPostid(post)}/reactions/tester`)
      .expect(200);
  });

  test("POST /reactions endpoint status code and response 500", async () =>
    request(app).post("/reactions").send({}).expect(500));
  test("POST /reactions  endpoint status code and response 201", async () =>
    request(app)
      .post("/reactions")
      .send({
        postid: "something",
        poster: "something",
        username: "something",
        time: 1,
        type: "something",
      })
      .expect(201));

  test("DELETE /:id/reactions/:username/:type endpoint status code and response 404", async () =>
    request(app).delete("//reactions//").send({}).expect(404));
  test("DELETE /:id/reactions/:username/:type  endpoint status code and response 200", async () => {
    const response = await createUser();
    const post = await createPost(response._id, "tester", 1);
    createReaction("tester", 1, "like", "tester");
    return request(app)
      .delete(`/${getPostid(post)}/reactions/tester/like`)
      .expect(200);
  });

  test("GET /:id/comments endpoint status code and response 404", async () =>
    request(app).get("//comments").send({}).expect(404));
  test("GET /:id/comments  endpoint status code and response 200", async () => {
    const response = await createUser();
    const post = await createPost(response._id, "tester", 1);
    return request(app)
      .get(`/${getPostid(post)}/comments`)
      .expect(200);
  });

  test("POST /:id/comments endpoint status code and response 500", async () =>
    request(app).post("/a/comments").send({}).expect(500));
  test("POST /:id/comments  endpoint status code and response 201", async () => {
    const response = await createUser();
    const post = await createPost(response._id, "tester", 1);
    return request(app)
      .post(`/${getPostid(post)}/comments`)
      .send({
        postId: getPostid(post),
        commenter: "tester",
        content: "nice post",
        commentTime: 1,
      })
      .expect(201);
  });
});
