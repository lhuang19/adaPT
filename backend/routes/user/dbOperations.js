const getUserData = async (db, username) => {
  try {
    const result = await db.collection("Users").findOne({ username: username });
    if (result === null) throw new Error();
    const copy = { ...result };
    delete copy.password;
    return copy;
  } catch (err) {
    console.error(err);
    throw new Error("could not find user");
  }
};

const getUsers = async (db) => {
  try {
    const result = await db.collection("Users").find({}).toArray();
    if (result === null) throw new Error();
    const usernameList = [];
    result.forEach((doc) => usernameList.push(doc.username));
    return usernameList;
  } catch (err) {
    console.error(err);
    throw new Error("could not find users");
  }
};

module.exports = { getUserData, getUsers };
