import "@testing-library/jest-dom";
import "@testing-library/user-event";

window.ResizeObserver = require("resize-observer-polyfill");

export const mockedDoAPIRequest = jest.fn((url, data) => {
  if (url.startsWith("/post") && url.endsWith("/comments")) {
    return {
      data: [
        {
          postId: "TonyPT10",
          commenter: "OtherPT",
          content: "nice post",
          commentTime: 15,
          users: "string",
        },
      ],
    };
  }

  if (url.startsWith("/exercise/feed")) {
    return {
      data: [
        {
          name: "exercise",
          sets: 2,
          reps: 10,
          instructions: "squat",
          setsCompleted: 0,
          creationTime: 121,
        },
      ],
    };
  }
  if (url.startsWith("/post/feed/")) {
    return {
      data: [
        {
          title: "some title",
          body: "some body",
          time: "some time",
          poster: "tester",
          users: "some user",
          media: "some media",
        },
      ],
    };
  }
  if (url.startsWith("/post/")) {
    return {
      data: {
        smileCount: 10,
        likeCount: 3,
        checkCount: 6,
        smiled: true,
        liked: false,
        checked: false,
      },
    };
  }
  if (url.startsWith("/user")) {
    return {
      data: {
        username: "tester",
        password: "tester",
        firstname: "tester",
        lastname: "tester",
        role: "PT",
        registerTime: 1,
        friends: ["tester2"],
        freindRequests: [],
      },
    };
  }
  if (url.startsWith("/login/signup")) {
    return data.body.role === "Patient"
      ? {
          data: {},
        }
      : { error: "test message" };
  }
  if (url.startsWith("/login/returning")) {
    if (url.endsWith("mocked error")) {
      throw new Error();
    }
    return url.endsWith("mocked true")
      ? {
          data: { somedata: "cool" },
        }
      : {};
  }
  if (url.startsWith("/login")) {
    if (!data || !data.body || !(data.body.password === "some password"))
      return { error: "incorrect password" };
    return {
      data: {
        username: "tester",
        password: "secretPassword",
        title: "some title",
        body: "some body",
        time: "some time",
        poster: "tester",
        users: "some user",
        media: "some media",
      },
    };
  }

  if (url.startsWith("/chat")) {
    return {
      data: [
        {
          body: "some body",
          time: 1,
          sender: "tester",
          receiver: "tester2",
          senderFirstname: "Larry",
        },
      ],
    };
  }

  return {
    data: {
      username: "tester",
      password: "secretPassword",
      title: "some title",
      body: "some body",
      time: "some time",
      poster: "tester",
      users: "some user",
      media: "some media",
    },
  };
});

jest.mock("../src/modules/api", () => ({
  getApiURL: (e) => `http://localhost:8000/api${e}`,
  doAPIRequest: mockedDoAPIRequest,
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn().mockReturnValue({ name: "tester" }),
}));

global.console = {
  ...console,
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
// uncomment to ignore a specific log level
// log: jest.fn()
