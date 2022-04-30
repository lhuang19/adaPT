const Users = require("../models/user");
const crypto = require("crypto");

const secret = "somesecrethash";

function getHash(input) {
  const sha256Hasher = crypto.createHmac("sha256", secret);
  const hash = sha256Hasher.update(input).digest("hex");
  return hash;
}

const friendStatus = async (username1, username2) => {
  if (!username1 || !username2) throw new Error("params not filled");
  try {
    const result1 = await Users.findOne({ username: username1 }).exec();
    const result2 = await Users.findOne({ username: username2 }).exec();
    if (result1 === null || result2 === null) throw new Error();

    let status = -1;

    result1.friends.forEach(element => {
      if (element === result2.username) {
        status = 0;
      }
    });
    result1.friendRequests.forEach(element => {
      if (element === result2.username) {
        status = 1;
      }
    });
    result2.friendRequests.forEach(element => {
      if (element === result1.username) {
        status = 2;
      }
    });
    return status;
  } catch (err) {
    console.error(err);
    throw new Error("could not find user");
  }
};

const addFriendRequest = async (username1, username2) => {
  if (!username1 || !username2) throw new Error("params not filled");
  try {
    const result1 = await Users.findOne({ username1 }).exec();
    const result2 = await Users.findOne({ username2 }).exec();
    if (result1 === null || result2 === null) throw new Error();
    result1.friendRequests.push(username2);
    await Users.updateOne({ username: username1 }, { friendRequests: result1.friendRequests });
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
    const newFR = result1.friendRequests.filter(function(value, index, arr) {
      return value !== username2;
    });
    await Users.updateOne({ username: username1 }, { friendRequests: newFR });
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
    await Users.updateOne({ username: username1 }, { friends: result1.friends });
    await Users.updateOne({ username: username2 }, { friends: result2.friends });
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
    const newF1 = result1.friends.filter(function(value, index, arr) {
      return value !== username2;
    });
    const newF2 = result2.friends.filter(function(value, index, arr) {
      return value !== username1;
    });
    await Users.updateOne({ username: username1 }, { friends: newF1 });
    await Users.updateOne({ username: username2 }, { friends: newF2 });
  } catch (err) {
    console.error(err);
    throw new Error("could not find user");
  }
};

const deleteProfile = async (user) => {
  if (!username) throw new Error("params not filled");
  try {
    await Users.deleteOne({ username: user }).exec();
  } catch (err) {
    console.error(err);
    throw new Error("could not find user");
  }
}

const updateProfile = async (user) => {
  if (!user || !user.username)
    throw new Error("params not filled");
  if ((await Users.findOne({ username: user.username }).exec()) === null)
    throw new Error();
  if (!user.password) {
    await Users.updateOne({ username: user.username }, {
      firstname: user.firstname,
      lastname: user.lastname,
    });
  } else {
    await Users.updateOne({ username: user.username }, {
      firstname: user.firstname,
      lastname: user.lastname,
      password: getHash(user.password),
    });
  }
}

const authenticateUser = async (user, password) => {
  if (!user || !password) throw new Error("params not filled");
  try {
    const result = await Users.findOne({ username: user }).select("+password").exec();
    if (result === null) throw new Error();
    const hashed = getHash(password);
    if (hashed === result.password) return true;
    return false;
  } catch (err) {
    console.error(err);
    throw new Error("could not find user");
  }
}

module.exports = {
  friendStatus,
  addFriendRequest,
  deleteFriendRequest,
  addFriend,
  deleteFriend,
  deleteProfile,
  updateProfile,
  authenticateUser,
};
