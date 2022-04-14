const crypto = require("crypto");
const Users = require("../models/user");

const secret = "somesecrethash";

function getHash(input) {
  const sha256Hasher = crypto.createHmac("sha256", secret);
  const hash = sha256Hasher.update(input).digest("hex");
  return hash;
}

function removePassword(input) {
  const copy = { ...input._doc };
  delete copy.password;
  return copy;
}

const login = async (user) => {
  if (!user || !user.password || !user.username)
    throw new Error("params not filled");
  try {
    const result = await Users.findOne({ username: user.username })
      .select("+password")
      .exec();
    if (result === null || result.password !== getHash(user.password))
      throw new Error();
    return removePassword(result);
  } catch (err) {
    console.error(err);
    throw new Error("could not login");
  }
};

const signup = async (user) => {
  if (!user || !user.password || !user.username)
    throw new Error("params not filled");
  try {
    if ((await Users.findOne({ username: user.username }).exec()) != null)
      throw new Error();

    const ret = await Users.create({
      ...user,
      password: getHash(user.password),
    });
    return removePassword(ret);
  } catch (err) {
    console.error(err);
    throw new Error("could not create account");
  }
};

module.exports = {
  login,
  signup,
};
