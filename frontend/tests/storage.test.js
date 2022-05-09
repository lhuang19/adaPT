/**
 * @jest-environment jsdom
 */

const { addLoginToken, checkLoggedIn, logout } = jest.requireActual(
  "../src/modules/storage"
);

test("test addLoginToken", () => {
  jest.spyOn(window.localStorage.__proto__, "setItem");
  window.localStorage.__proto__.setItem = jest.fn();
  addLoginToken("some token");
  expect(localStorage.setItem).toHaveBeenCalled();
});

test("test logout", () => {
  jest.spyOn(window.localStorage.__proto__, "removeItem");
  window.localStorage.__proto__.setItem = jest.fn();
  logout();
  expect(localStorage.removeItem).toHaveBeenCalled();
});
