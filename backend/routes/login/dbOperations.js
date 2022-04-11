const crypto = require("crypto");

const secret = "somesecrethash";

function getHash(input) {
  const sha256Hasher = crypto.createHmac("sha256", secret);
  const hash = sha256Hasher.update(input).digest("hex");
  return hash;
}

const login = async (db, user) => {
  try {
    const hashedPassword = getHash(user.password);
    const result = await db
      .collection("Users")
      .findOne({ username: user.username });
    if (result === null || result.password != hashedPassword) throw new Error();
    const copy = { ...result };
    delete copy.password;
    return copy;
  } catch (err) {
    console.error(err);
    throw new Error("could not login");
  }
};

const signup = async (db, user) => {
  try {
    const result = await db
      .collection("Users")
      .findOne({ username: user.username });
    if (result != null) throw new Error();
    const hashedPassword = await getHash(user.password);

    const copy = { ...user };
    copy.password = hashedPassword;
    const ret = await db.collection("Users").insertOne(copy);
    return ret;
  } catch (err) {
    console.error(err);
    throw new Error("could not create account");
  }
};

module.exports = {
  login,
  signup,
};
