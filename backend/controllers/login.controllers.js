const crypto = require("crypto");
const Users = require("../models/user");
const jwt = require("jsonwebtoken");

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
  const result = await Users.findOne({ username: user.username })
    .select("+password +unsuccessfulAttempts +timeOut")
    .exec();

  const currTime = new Date().getTime();
  if (result.unsuccessfulAttempts >= 2 || result.timeOut > currTime) {
    if (result.unsuccessfulAttempts >= 2) {
      await Users.findOneAndUpdate(
        { username: user.username },
        { unsuccessfulAttempts: 0 }
      );
    }
    let timoutUntil = new Date(currTime + 1 * 60000).getTime();
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
  if (result === null || result.password !== getHash(user.password)) {
    await Users.findOneAndUpdate(
      { username: user.username },
      { unsuccessfulAttempts: result.unsuccessfulAttempts + 1 }
    );
    throw new Error("Incorrect password");
  }

  let payload = removePassword(result);
  const token = jwt.sign(payload, process.env.SECRETKEY, {
    expiresIn: "15 min",
  });
  return { ...removePassword(result), token };
};

const signup = async (user) => {
  if (!user || !user.password || !user.username)
    throw new Error("params not filled");
  if ((await Users.findOne({ username: user.username }).exec()) != null)
    throw new Error();

  const ret = await Users.create({
    ...user,
    password: getHash(user.password),
    registerTime: new Date().toLocaleString(),
  });
  let payload = removePassword(ret);
  const token = jwt.sign(payload, process.env.SECRETKEY, {
    expiresIn: "15 min",
  });
  return { ...removePassword(ret), token };
};

const returning = async (token) => {
  if (!token) throw new Error("params not filled");
  try {
    const payload = jwt.verify(token, process.env.SECRETKEY);
    return payload;
  } catch (err) {
    console.error(err);
    throw new Error("jwt verification failed");
  }
};

module.exports = {
  login,
  signup,
  returning,
};
