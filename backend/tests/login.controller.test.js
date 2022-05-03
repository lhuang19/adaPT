const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Users = require("../models/user");

const lib = require("../controllers/login.controllers");

dotenv.config();

const sleep = (ms) =>
  new Promise((r) => {
    setTimeout(r, ms);
  });

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_TEST_URL);
});

beforeEach(async () => {
  const result = await Users.findOne({});
  if (result !== null) {
    Users.deleteMany({}, () => {});
  }
  await sleep(20);
});

async function createUser() {
  return Users.create({
    username: "tester",
    firstname: "first",
    lastname: "last",
    role: "PT",
    password: lib.getHash("some password"),
    registerTime: new Date().toLocaleString(),
    friends: [],
    friendRequests: [],
  });
}

describe("login", () => {
  test("params not filled", async () => {
    await expect(lib.login({})).rejects.toThrow("params not filled");
  });
  test("user not found", async () => {
    const userData = { username: "tester", password: "password" };
    await expect(lib.login(userData)).rejects.toThrow("User not found");
  });

  test("correct password", async () => {
    await createUser();
    const userData = { username: "tester", password: "some password" };
    const result = await lib.login(userData);
    expect(result).toMatchObject({
      username: "tester",
      firstname: "first",
      lastname: "last",
      role: "PT",
    });
  });

  test("unsuccessfulAttempts and timeout", async () => {
    await createUser();
    const userData = { username: "tester", password: "some bad password" };
    await expect(lib.login(userData)).rejects.toThrow("Incorrect password");
    let result = await Users.findOne({
      username: "tester",
    })
      .select("+unsuccessfulAttempts +timeOut")
      .exec();
    expect(result.unsuccessfulAttempts).toBe(1);
    expect(result.timeOut).toBeFalsy();

    await expect(lib.login(userData)).rejects.toThrow("Incorrect password");
    result = await Users.findOne({
      username: "tester",
    })
      .select("+unsuccessfulAttempts +timeOut")
      .exec();
    expect(result.unsuccessfulAttempts).toBe(2);
    expect(result.timeOut).toBeFalsy();

    await expect(lib.login(userData)).rejects.toThrow(
      "Too many unsuccessful attempts. Time out: 3m 0s"
    );
    result = await Users.findOne({
      username: "tester",
    })
      .select("+unsuccessfulAttempts +timeOut")
      .exec();
    expect(result.unsuccessfulAttempts).toBe(0);
    expect(result.timeOut).toBeTruthy();
    const previousTimeOut = result.timeOut;

    await expect(lib.login(userData)).rejects.toThrow();
    result = await Users.findOne({
      username: "tester",
    })
      .select("+unsuccessfulAttempts +timeOut")
      .exec();
    expect(result.unsuccessfulAttempts).toBe(0);
    expect(result.timeOut).toBe(previousTimeOut);
  });
});

describe("signup", () => {
  test("params not filled", async () => {
    await expect(lib.signup({})).rejects.toThrow("params not filled");
  });
  test("user exists", async () => {
    const getHash = jest.fn();
    getHash.mockReturnValue("some hashed password");
    await createUser();
    await expect(
      lib.signup({
        username: "tester",
        firstname: "first",
        lastname: "last",
        role: "PT",
        password: "some password",
      })
    ).rejects.toThrow("user exists");
  });
  test("create user", async () => {
    const result = await lib.signup({
      username: "tester",
      firstname: "first",
      lastname: "last",
      role: "PT",
      password: "some password",
    });
    expect(result).toMatchObject({
      username: "tester",
      firstname: "first",
      lastname: "last",
      role: "PT",
    });
  });
});

describe("returning", () => {
  test("params not filled", async () => {
    await expect(lib.returning()).rejects.toThrow("params not filled");
  });
  test("token not valid", async () => {
    await expect(
      lib.returning(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      )
    ).rejects.toThrow();
  });
});
