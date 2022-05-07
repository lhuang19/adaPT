const Users = require("../models/user");
const Posts = require("../models/posts");
const Comments = require("../models/comments");
const Reactions = require("../models/reactions");
const {
  connectToDB,
  disconnectDB,
  createUser,
  createPost,
  createReaction,
  createComment,
  sleep,
} = require("./utils");

const lib = require("../controllers/post.controllers");

beforeAll(async () => {
  await connectToDB();
});
afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  if ((await Users.findOne({})) !== null) {
    Users.deleteMany({}, () => {});
  }
  if ((await Posts.findOne({})) !== null) {
    Posts.deleteMany({}, () => {});
  }
  if ((await Comments.findOne({})) !== null) {
    Comments.deleteMany({}, () => {});
  }
  if ((await Reactions.findOne({})) !== null) {
    Reactions.deleteMany({}, () => {});
  }
  await sleep(10);
});

describe("Posts", () => {
  describe("post Post", () => {
    test("params not filled", async () => {
      await expect(lib.postPost()).rejects.toThrow("params not filled");
    });
    test("successful post", async () => {
      const user = await createUser();
      const postData = {
        title: "test title",
        body: "test body",
        time: new Date(),
        poster: "tester",
      };
      const result = await lib.postPost(postData);

      expect(result).toMatchObject({
        title: "test title",
        body: "test body",
        poster: "tester",
        users: user._id,
      });
    });

    test("no user post", async () => {
      const postData = {
        title: "test title",
        body: "test body",
        time: new Date(),
        poster: "tester",
      };
      await expect(lib.postPost(postData)).rejects.toThrow("user not found");
    });
  });

  describe("get Posts both ways", () => {
    test("params not filled", async () => {
      await expect(lib.getPosts()).rejects.toThrow("params not filled");
    });
    test("get one user post", async () => {
      const user = await createUser();

      await createPost(user._id, "tester");
      const result = await lib.getPosts("tester");
      expect(result).toMatchObject([
        {
          title: "test title",
          body: "test body",
          poster: "tester",
        },
      ]);
    });
    test("params not filled all", async () => {
      await expect(lib.getPostsAll()).rejects.toThrow("params not filled");
    });
    test("get post with freinds", async () => {
      const user = await createUser();

      await createPost(user._id, "tester");
      const result = await lib.getPostsAll("tester");
      expect(result).toMatchObject([
        {
          title: "test title",
          body: "test body",
          poster: "tester",
        },
      ]);
    });

    test("get two user posts ", async () => {
      const user = await createUser();
      await createPost(user._id);
      const user2 = await createUser("test poster 2");
      await createPost(user2._id, "test poster 2");
      const result = await lib.getPosts(["test poster", "test poster 2"]);
      expect(result).toMatchObject([
        {
          title: "test title",
          body: "test body",
          poster: "test poster 2",
          users: user2._id,
        },
        {
          title: "test title",
          body: "test body",
          poster: "test poster",
          users: user._id,
        },
      ]);
    });
  });

  describe("delete posts", () => {
    test("params not filled", async () => {
      await expect(lib.deletePost()).rejects.toThrow("params not filled");
    });
    test("delete works", async () => {
      const user = await createUser();
      const post = await createPost(user._id);
      await createReaction(post.poster, post.time);
      await createComment(post.poster, post.time, user._id, post.poster);
      expect((await Posts.find({})).length).toBe(1);
      expect((await Reactions.find({})).length).toBe(1);
      expect((await Comments.find({})).length).toBe(1);
      await lib.deletePost(post.poster, post.time);
      expect((await Posts.find({})).length).toBe(0);
      expect((await Reactions.find({})).length).toBe(0);
      expect((await Comments.find({})).length).toBe(0);
    });
  });
});

describe("Reactions", () => {
  let user;
  let post;
  beforeEach(async () => {
    user = await createUser();
    post = await createPost(user._id);
  });
  describe("get reactions", () => {
    test("params not filled", async () => {
      await expect(lib.getReactions()).rejects.toThrow("params not filled");
    });
    test("non poster like and poster like", async () => {
      await createReaction(post.poster, post.time, "like");
      let result = await lib.getReactions(
        post.poster + post.time.toString(),
        "test poster"
      );
      expect(result).toMatchObject({
        smileCount: 0,
        likeCount: 1,
        checkCount: 0,
        smiled: false,
        liked: false,
        checked: false,
      });
      await createReaction(post.poster, post.time, "like", "test poster");
      result = await lib.getReactions(
        post.poster + post.time.toString(),
        "test poster"
      );
      expect(result).toMatchObject({
        smileCount: 0,
        likeCount: 2,
        checkCount: 0,
        smiled: false,
        liked: true,
        checked: false,
      });
      await createReaction(post.poster, post.time, "smile", "test poster");
      await createReaction(post.poster, post.time, "check", "test poster");
      result = await lib.getReactions(
        post.poster + post.time.toString(),
        "test poster"
      );
      expect(result).toMatchObject({
        smileCount: 1,
        likeCount: 2,
        checkCount: 1,
        smiled: true,
        liked: true,
        checked: true,
      });
    });
  });
  describe("post reaction", () => {
    test("params not filled", async () => {
      await expect(lib.postReaction()).rejects.toThrow("params not filled");
    });
    test("post reaction", async () => {
      const result = await lib.postReaction({
        poster: "test poster",
        time: 1,
        username: "test poster",
        type: "like",
      });
      expect(result).toMatchObject({
        postid: "test poster1",
        poster: "test poster",
        time: 1,
        username: "test poster",
        type: "like",
      });
    });
  });
  describe("delete reaction", () => {
    test("params not filled", async () => {
      await expect(lib.deleteReaction()).rejects.toThrow("params not filled");
    });
    test("delete valid reaction", async () => {
      await createReaction(post.poster, post.time);

      const result = await lib.deleteReaction(
        post.poster + post.time.toString(),
        "some rando",
        "like"
      );
      expect(result).toMatchObject({ deletedCount: 1 });
    });
  });
});

describe("Commments", () => {
  let user;
  let post;
  beforeEach(async () => {
    user = await createUser();
    post = await createPost(user._id);
  });
  describe("get comments", () => {
    test("params not filled", async () => {
      await expect(lib.getComments()).rejects.toThrow("params not filled");
    });
    test("gets existing comment", async () => {
      await createComment(post.poster, post.time, user._id, post.poster);
      const result = await lib.getComments(post.poster + post.time.toString());
      expect(result).toMatchObject([
        {
          postId: post.poster + post.time.toString(),
          commenter: "test poster",
          content: "test content",
          commentTime: 1,
          users: { _id: user._id },
        },
      ]);
    });
  });
  describe("post comment", () => {
    test("params not filled", async () => {
      await expect(lib.postComment()).rejects.toThrow("params not filled");
    });
    test("post valid comment", async () => {
      const result = await lib.postComment(post.poster + post.time.toString(), {
        content: "some content",
        commenter: user.username,
        commentTime: 1,
      });
      expect(result).toMatchObject({
        postId: post.poster + post.time.toString(),
        commenter: user.username,
        content: "some content",
        commentTime: 1,
        users: user._id,
      });
    });
  });
});
