/**
 * @jest-environment jsdom
 */
const { doAPIRequest } = jest.requireActual("../src/modules/api");

test("test getApiURL not production", () => {
  const { getApiURL } = jest.requireActual("../src/modules/api");
  expect(getApiURL("/login")).toBe("http://localhost:8000/api/login");
});
test("test getApiURL production", () => {
  process.env.NODE_ENV = "production";
  const { getApiURL } = jest.requireActual("../src/modules/api");
  expect(getApiURL("/login")).toBe("https://adapt-350.herokuapp.com/api/login");
  process.env.NODE_ENV = "test";
});

test("test doAPIRequest", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve("mocked resolve"),
    })
  );
  expect(await doAPIRequest("/", {})).toBe("mocked resolve");
});

test("test doAPIRequest fail", async () => {
  global.fetch = jest.fn(() =>
    Promise.reject({
      json: () => Promise.resolve("mocked fail"),
    })
  );

  expect(await doAPIRequest("/", {})).toBe(undefined);
});
