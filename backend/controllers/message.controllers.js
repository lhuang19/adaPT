const Messages = require("../models/messages");

const postMessage = async (messageData) => {
  if (!messageData) throw new Error("params not filled");

  try {
    const result = await Messages.create({
      ...messageData,
    });
    if (result === null) throw new Error();
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not add message");
  }
};

const getMessages = async (username) => {
  if (!username) throw new Error("params not filled");

  try {
    const result = await Messages.find({
      $or: [{ sender: username }, { receiver: username }],
    }).exec();
    result.sort((a, b) => a.time - b.time);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("could not get messages");
  }
};

module.exports = {
  postMessage,
  getMessages,
};
