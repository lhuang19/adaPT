const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Users = require("../models/user");
const Posts = require("../models/posts");
const Comments = require("../models/comments");
const Reactions = require("../models/reactions");
const lib = require("../controllers/login.controllers");

dotenv.config();

async function createUser(username, role) {
  return Users.create({
    username: username || "tester",
    firstname: "first",
    lastname: "last",
    role: role || "PT",
    password: lib.getHash("some password"),
    registerTime: new Date().toLocaleString(),
    friends: [],
    friendRequests: [],
  });
}
async function createPost(id, poster, time) {
  return Posts.create({
    title: "test title",
    body: "test body",
    time: time || new Date(),
    poster: poster || "test poster",
    users: id,
  });
}
async function createReaction(poster, time, type, username) {
  return Reactions.create({
    postid: poster + time.toString(),
    poster: "test poster",
    username: username || "some rando",
    time: time || 1,
    type: type || "like",
  });
}
async function createComment(poster, time, usersId, username) {
  return Comments.create({
    postId: poster + time.toString(),
    commenter: username || "test poster",
    content: "test content",
    commentTime: 1,
    users: usersId,
  });
}

const sleep = (ms) =>
  new Promise((r) => {
    setTimeout(r, ms);
  });

const getPostid = (post) => post.poster + post.time.toString();

const connectToDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await sleep(3000);
  }
  try {
    if (mongoose.connection.readyState === 0)
      await mongoose.connect(process.env.MONGO_TEST_URL);
  } catch (error) {
    console.error(error);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  await sleep(100);
};

module.exports = {
  createUser,
  createPost,
  createReaction,
  createComment,
  sleep,
  getPostid,
  connectToDB,
  disconnectDB,
};
