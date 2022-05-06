const Users = require("../models/user");

const getUserData = async (username) => {
  if (!username) throw new Error("params not filled");
  try {
    const result = await Users.findOne({ username }).exec();
    if (result === null) throw new Error();
    return result;
  } catch (err) {
    throw new Error("could not find user");
  }
};

const getUsers = async () => {
  try {
    const result = await Users.find({}).exec();
    if (result === null || result.length === 0) throw new Error();
    const usernameList = [];
    result.forEach((doc) => usernameList.push(doc.username));
    return usernameList;
  } catch (err) {
    throw new Error("could not find users");
  }
};

module.exports = { getUserData, getUsers };
