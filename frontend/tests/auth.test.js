/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

const mockedUsedNavigate = jest.fn();
let mockedUseLocation = { pathname: "/" };
const mockCheckLoggedIn = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => mockedUseLocation,
}));

jest.mock("../src/modules/storage", () => ({
  checkLoggedIn: mockCheckLoggedIn,
}));
describe("mock signed in", () => {
  test("Auth navigate correct creds", async () => {
    mockCheckLoggedIn.mockReturnValueOnce("mocked true");
    const { WithAuth } = require("../src/context/Auth");
    render(
      <Router>
        <WithAuth />
      </Router>
    );
  });

  test("Auth navigate correct creds navigate to home", async () => {
    mockCheckLoggedIn.mockReturnValueOnce("mocked true");
    mockedUseLocation = { pathname: "/login" };

    const { WithAuth } = require("../src/context/Auth");
    render(
      <Router>
        <WithAuth />
      </Router>
    );
    await new Promise((r) => setTimeout(r, 100));
    await expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
    mockedUseLocation = { pathname: "/" };
  });
});

describe("mock not", () => {
  test("Auth navigate incorrect creds", async () => {
    mockCheckLoggedIn.mockReturnValueOnce("mocked false");

    const { WithAuth } = require("../src/context/Auth");
    render(
      <Router>
        <WithAuth />
      </Router>
    );
    await new Promise((r) => setTimeout(r, 100));
    await expect(mockedUsedNavigate).toHaveBeenCalledWith("/login");
  });
});

describe("mock error", () => {
  test("Auth navigate incorrect creds", async () => {
    mockCheckLoggedIn.mockReturnValueOnce("mocked error");

    const { WithAuth } = require("../src/context/Auth");
    render(
      <Router>
        <WithAuth />
      </Router>
    );
    await new Promise((r) => setTimeout(r, 100));
    await expect(mockedUsedNavigate).toHaveBeenCalledWith("/login");
  });
});
