const Users = require("../models/user");
const Posts = require("../models/posts");
const Comments = require("../models/comments");
const Reactions = require("../models/reactions");

const postPost = async (postData) => {
  if (!postData) throw new Error("params not filled");

  try {
    const user = await Users.findOne({ username: postData.poster }).exec();
    const result = await Posts.create({
      ...postData,
      users: user._id,
    });
    if (result === null) throw new Error();
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not add post");
  }
};

const getPosts = async (usernamesToFetch) => {
  if (!usernamesToFetch) throw new Error("params not filled");

  try {
    const result = await Posts.find({
      poster: { $in: usernamesToFetch },
    })
      .populate("users")
      .exec();
    result.sort((a, b) => b.time - a.time);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not get posts");
  }
};

const deletePost = async (postData) => {
  if (!postData || !postData.poster || !postData.time)
    throw new Error("params not filled");

  try {
    await Reactions.deleteMany({
      poster: postData.poster,
      time: postData.time,
    }).exec();
    await Comments.deleteMany({
      postId: postData.poster + postData.time.toString(),
    }).exec();
    return await Posts.deleteOne({
      poster: postData.poster,
      time: postData.time,
    }).exec();
  } catch (err) {
    console.error(err);
    throw new Error("could delete post and/or reactions");
  }
};

const getReactions = async (postid, username) => {
  if (!postid || !username) throw new Error("params not filled");

  try {
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
  } catch (err) {
    console.error(err);
    throw new Error("could not get reactions");
  }
};

const postReaction = async (data) => {
  if (!data || !data.poster || !data.time || !data.username || !data.type)
    throw new Error("params not filled");

  try {
    const result = await Reactions.create({
      postid: data.poster + data.time.toString(),
      ...data,
    });
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not post reactions");
  }
};

const deleteReaction = async (postid, username, type) => {
  if (!postid || !username || !type) throw new Error("params not filled");

  try {
    const result = await Reactions.deleteOne({ postid, username, type }).exec();
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not get reactions");
  }
};

const getComments = async (postId) => {
  if (!postId) throw new Error("params not filled");

  try {
    const result = await Comments.find({ postId }).populate("users").exec();
    result.sort((a, b) => b.commetTime - a.commentTime);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not get comments");
  }
};

const postComment = async (postId, data) => {
  if (!postId || !data || !data.commenter || !data.content || !data.commentTime)
    throw new Error("params not filled");

  try {
    const user = await Users.findOne({ username: data.commenter }).exec();
    const result = await Comments.create({
      ...data,
      postId,
      users: user._id,
    });

    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not post comments");
  }
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
