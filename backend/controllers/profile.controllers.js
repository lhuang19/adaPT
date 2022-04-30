const crypto = require("crypto");
const Users = require("../models/user");

const secret = "somesecrethash";

function getHash(input) {
  const sha256Hasher = crypto.createHmac("sha256", secret);
  const hash = sha256Hasher.update(input).digest("hex");
  return hash;
}

const friendStatus = (user1, user2) => {
  let status = -1;

  user1.friends.forEach((element) => {
    if (element === user2.username) {
      status = 0;
    }
  });
  user1.friendRequests.forEach((element) => {
    if (element === user2.username) {
      status = 1;
    }
  });
  user2.friendRequests.forEach((element) => {
    if (element === user1.username) {
      status = 2;
    }
  });
  return status;
};

const getFriendStatus = async (username1, username2) => {
  if (!username1 || !username2) throw new Error("params not filled");
  try {
    const result1 = await Users.findOne({ username: username1 }).exec();
    const result2 = await Users.findOne({ username: username2 }).exec();
    if (result1 === null || result2 === null) throw new Error();
    return friendStatus(result1, result2);
  } catch (err) {
    throw new Error("could not find user");
  }
};

const addFriendRequest = async (username1, username2) => {
  if (!username1 || !username2) throw new Error("params not filled");
  try {
    const result1 = await Users.findOne({ username: username1 }).exec();
    const result2 = await Users.findOne({ username: username2 }).exec();
    if (result1 === null || result2 === null) throw new Error();
    const status = friendStatus(result1, result2);
    if (status !== -1) {
      return status;
    }
    result1.friendRequests.push(username2);
    await Users.updateOne(
      { username: username1 },
      { friendRequests: result1.friendRequests }
    );
    return 1;
  } catch (err) {
    console.error(err);
    throw new Error("could not find user");
  }
};

const deleteFriendRequest = async (username1, username2) => {
  if (!username1 || !username2) throw new Error("params not filled");
  try {
    const result1 = await Users.findOne({ username: username1 }).exec();
    const result2 = await Users.findOne({ username: username2 }).exec();
    if (result1 === null || result2 === null) throw new Error();
    const status = friendStatus(result1, result2);
    if (status !== 1) {
      return status;
    }
    const newFR = result1.friendRequests.filter(
      (value, index, arr) => value !== username2
    );
    await Users.updateOne({ username: username1 }, { friendRequests: newFR });
    return 100;
  } catch (err) {
    console.error(err);
    throw new Error("could not find user");
  }
};

const addFriend = async (username1, username2) => {
  if (!username1 || !username2) throw new Error("params not filled");
  try {
    const result1 = await Users.findOne({ username: username1 }).exec();
    const result2 = await Users.findOne({ username: username2 }).exec();
    if (result1 === null || result2 === null) throw new Error();
    result1.friends.push(username2);
    result2.friends.push(username1);
    await Users.updateOne(
      { username: username1 },
      { friends: result1.friends }
    );
    await Users.updateOne(
      { username: username2 },
      { friends: result2.friends }
    );
  } catch (err) {
    console.error(err);
    throw new Error("could not find user");
  }
};

const deleteFriend = async (username1, username2) => {
  if (!username1 || !username2) throw new Error("params not filled");
  try {
    const result1 = await Users.findOne({ username: username1 }).exec();
    const result2 = await Users.findOne({ username: username2 }).exec();
    if (result1 === null || result2 === null) throw new Error();
    const status = friendStatus(result1, result2);
    if (status !== 0) {
      return status;
    }
    const newF1 = result1.friends.filter(
      (value, index, arr) => value !== username2
    );
    const newF2 = result2.friends.filter(
      (value, index, arr) => value !== username1
    );
    await Users.updateOne({ username: username1 }, { friends: newF1 });
    await Users.updateOne({ username: username2 }, { friends: newF2 });
    return 100;
  } catch (err) {
    console.error(err);
    throw new Error("could not find user");
  }
};

const deleteProfile = async (user) => {
  if (!user) throw new Error("params not filled");
  try {
    await Users.deleteOne({ username: user }).exec();
  } catch (err) {
    console.error(err);
    throw new Error("could not find user");
  }
};

const updateProfile = async (user) => {
  if (!user || !user.username) throw new Error("params not filled");
  if ((await Users.findOne({ username: user.username }).exec()) === null)
    throw new Error();
  if (!user.password) {
    await Users.updateOne(
      { username: user.username },
      {
        firstname: user.firstname,
        lastname: user.lastname,
      }
    );
  } else {
    await Users.updateOne(
      { username: user.username },
      {
        firstname: user.firstname,
        lastname: user.lastname,
        password: getHash(user.password),
      }
    );
  }
};

const authenticateUser = async (user, password) => {
  if (!user || !password) throw new Error("params not filled");
  try {
    const result = await Users.findOne({ username: user })
      .select("+password")
      .exec();
    if (result === null) throw new Error();
    const hashed = getHash(password);
    if (hashed === result.password) return true;
    return false;
  } catch (err) {
    console.error(err);
    throw new Error("could not find user");
  }
};

module.exports = {
  getFriendStatus,
  addFriendRequest,
  deleteFriendRequest,
  addFriend,
  deleteFriend,
  deleteProfile,
  updateProfile,
  authenticateUser,
};
