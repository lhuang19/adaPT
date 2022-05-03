const Users = require("../models/user");
const Posts = require("../models/posts");
const Comments = require("../models/comments");
const Reactions = require("../models/reactions");

const postPost = async (postData) => {
  if (!postData) throw new Error("params not filled");

  const user = await Users.findOne({ username: postData.poster }).exec();
  if (user === null) throw new Error("user not found");
  const result = await Posts.create({
    ...postData,
    users: user._id,
  });

  return result;
};

const getPosts = async (usernamesToFetch) => {
  if (!usernamesToFetch) throw new Error("params not filled");

  const result = await Posts.find({
    poster: { $in: usernamesToFetch },
  })
    .populate("users")
    .exec();
  result.sort((a, b) => b.time - a.time);
  return result;
};

const deletePost = async (postData) => {
  if (!postData || !postData.poster || !postData.time)
    throw new Error("params not filled");

  await Reactions.deleteMany({
    poster: postData.poster,
    time: postData.time,
  }).exec();
  await Comments.deleteMany({
    postId: postData.poster + postData.time.toString(),
  }).exec();
  return Posts.deleteOne({
    poster: postData.poster,
    time: postData.time,
  }).exec();
};

const getReactions = async (postid, username) => {
  if (!postid || !username) throw new Error("params not filled");

  const smiles = await Reactions.find({ postid, type: "smile" }).exec();
  const likes = await Reactions.find({ postid, type: "like" }).exec();
  const checks = await Reactions.find({ postid, type: "check" }).exec();
  return {
    smileCount: smiles.length,
    likeCount: likes.length,
    checkCount: checks.length,
    smiled:
      smiles.filter((reaction) => reaction.username === username).length > 0,
    liked:
      likes.filter((reaction) => reaction.username === username).length > 0,
    checked:
      checks.filter((reaction) => reaction.username === username).length > 0,
  };
};

const postReaction = async (data) => {
  if (!data || !data.poster || !data.time || !data.username || !data.type)
    throw new Error("params not filled");

  const result = await Reactions.create({
    postid: data.poster + data.time.toString(),
    ...data,
  });
  return result;
};

const deleteReaction = async (postid, username, type) => {
  if (!postid || !username || !type) throw new Error("params not filled");

  const result = await Reactions.deleteOne({ postid, username, type }).exec();
  return result;
};

const getComments = async (postId) => {
  if (!postId) throw new Error("params not filled");

  const result = await Comments.find({ postId }).populate("users").exec();
  result.sort((a, b) => b.commetTime - a.commentTime);
  return result;
};

const postComment = async (postId, data) => {
  if (!postId || !data || !data.commenter || !data.content || !data.commentTime)
    throw new Error("params not filled");

  const user = await Users.findOne({ username: data.commenter }).exec();
  const result = await Comments.create({
    ...data,
    postId,
    users: user._id,
  });

  return result;
};

module.exports = {
  postPost,
  getPosts,
  deletePost,
  getReactions,
  postReaction,
  deleteReaction,
  getComments,
  postComment,
};
