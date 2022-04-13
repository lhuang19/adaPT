const postPost = async (db, postData) => {
  if (!postData) throw new Error("params not filled");

  try {
    const result = await db.collection("Posts").insertOne({
      _id: postData.poster + postData.time.toString(),
      ...postData,
    });
    if (result === null) throw new Error();
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could add post");
  }
};

const getPosts = async (db, usernamesToFetch) => {
  if (!usernamesToFetch) throw new Error("params not filled");

  try {
    const result = await db
      .collection("Posts")
      .find({ poster: { $in: usernamesToFetch } })
      .toArray();
    const names = await db.collection("Users").find({}).toArray();
    const aggregate = [];
    result.forEach((doc) => {
      const user = names.find((name) => doc.poster === name.username);
      if (user === undefined) throw new Error("data error");
      aggregate.push({
        ...doc,
        firstname: user.firstname,
        lastname: user.lastname,
      });
    });
    aggregate.sort((a, b) => b.time - a.time);
    return aggregate;
  } catch (err) {
    console.error(err);
    throw new Error("could not get posts");
  }
};

const deletePost = async (db, postData) => {
  if (!postData || !postData.poster || !postData.time)
    throw new Error("params not filled");

  try {
    await db
      .collection("Reactions")
      .deleteMany({ poster: postData.poster, time: postData.time });
    return await db
      .collection("Posts")
      .deleteOne({ poster: postData.poster, time: postData.time });
  } catch (err) {
    console.error(err);
    throw new Error("could delete post and/or reactions");
  }
};

const getReactions = async (db, postid, username) => {
  if (!postid || !username) throw new Error("params not filled");

  try {
    const smiles = await db
      .collection("Reactions")
      .find({ postid, type: "smile" })
      .toArray();
    const likes = await db
      .collection("Reactions")
      .find({ postid, type: "like" })
      .toArray();
    const checks = await db
      .collection("Reactions")
      .find({ postid, type: "check" })
      .toArray();
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

const postReaction = async (db, data) => {
  if (!data || !data.poster || !data.time || !data.username || !data.type)
    throw new Error("params not filled");

  try {
    const result = await db
      .collection("Reactions")
      .insertOne({ postid: data.poster + data.time.toString(), ...data });

    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not get reactions");
  }
};

const deleteReaction = async (db, postid, username, type) => {
  if (!postid || !username || !type) throw new Error("params not filled");

  try {
    const result = await db
      .collection("Reactions")
      .deleteOne({ postid, username, type });

    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not get reactions");
  }
};

const getComments = async (db, postId) => {
  if (!postId) throw new Error("params not filled");

  try {
    const result = await db.collection("Comments").find({ postId }).toArray();
    const names = await db.collection("Users").find({}).toArray();
    const aggregate = [];
    result.forEach((doc) => {
      const user = names.find((name) => doc.commenter === name.username);
      if (user === undefined) throw new Error("data error");
      aggregate.push({
        ...doc,
        firstname: user.firstname,
        lastname: user.lastname,
      });
    });
    aggregate.sort((a, b) => b.commetTime - a.commentTime);
    return aggregate;
  } catch (err) {
    console.error(err);
    throw new Error("could not get comments");
  }
};

const postComment = async (db, postId, data) => {
  if (!postId || !data || !data.commenter || !data.content || !data.commentTime)
    throw new Error("params not filled");

  try {
    const result = await db
      .collection("Comments")
      .insertOne({ postId, ...data });

    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not get comments");
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
