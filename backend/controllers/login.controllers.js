const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");

function getHash(input) {
  const sha256Hasher = crypto.createHmac("sha256", "somesecrethash");
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
  const result = await Users.findOne({ username: user.username })
    .select("+password +unsuccessfulAttempts +timeOut")
    .exec();
  if (result === null) {
    throw new Error("User not found");
  }
  const currTime = new Date().getTime();
  if (result.unsuccessfulAttempts >= 2 || result.timeOut > currTime) {
    if (result.unsuccessfulAttempts >= 2) {
      await Users.findOneAndUpdate(
        { username: user.username },
        { unsuccessfulAttempts: 0 }
      );
    }
    let timoutUntil = new Date(currTime + 3 * 60000).getTime();
    if (result.timeOut > currTime) {
      timoutUntil = result.timeOut;
    } else {
      await Users.findOneAndUpdate(
        { username: user.username },
        { timeOut: timoutUntil }
      );
    }
    const diff = new Date(timoutUntil - currTime);
    throw new Error(
      `Too many unsuccessful attempts. Time out: ${diff.getMinutes()}m ${diff.getSeconds()}s`
    );
  }
  if (result.password !== getHash(user.password)) {
    await Users.findOneAndUpdate(
      { username: user.username },
      { unsuccessfulAttempts: result.unsuccessfulAttempts + 1 }
    );
    throw new Error("Incorrect password");
  }

  const payload = removePassword(result);
  const token = jwt.sign(payload, process.env.SECRETKEY, {
    expiresIn: "15 min",
  });
  return { ...removePassword(result), token };
};

const signup = async (user) => {
  if (!user || !user.password || !user.username)
    throw new Error("params not filled");
  if ((await Users.findOne({ username: user.username }).exec()) != null)
    throw new Error("user exists");

  const ret = await Users.create({
    ...user,
    password: getHash(user.password),
    registerTime: new Date().toLocaleString(),
    friends: [],
    friendRequests: [],
  });

  const payload = removePassword(ret);
  const token = jwt.sign(payload, process.env.SECRETKEY, {
    expiresIn: "15 min",
  });
  return { ...removePassword(ret), token };
};

const returning = async (token) => {
  if (!token) throw new Error("params not filled");
  const payload = jwt.verify(token, process.env.SECRETKEY);
  return payload;
};

module.exports = {
  login,
  signup,
  returning,
  getHash,
};
