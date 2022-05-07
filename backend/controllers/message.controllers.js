const Messages = require("../models/messages");
const Users = require("../models/user");

const postMessage = async (messageData) => {
  if (!messageData) throw new Error("params not filled");
  const result = await Messages.create({
    ...messageData,
  });
  return result;
};

const getMessages = async (username) => {
  if (!username || !(await Users.findOne({ username })))
    throw new Error("params not filled");

  const result = await Messages.find({
    $or: [{ sender: username }, { receiver: username }],
  }).exec();
  result.sort((a, b) => a.time - b.time);
  return result;
};

module.exports = {
  postMessage,
  getMessages,
};
