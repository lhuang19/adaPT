/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthUserContext } from "../src/context/Auth";

import Login from "../src/components/Login/Login";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not...I'm not depending on the results so no need to put in a return value
}));

test("Login navigate correct creds", async () => {
  const mockSetCreds = jest.fn();
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester", firstname: "tester" },
          setCredentials: mockSetCreds,
        }}
      >
        <Login />
      </AuthUserContext.Provider>
    </Router>
  );
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "some username" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "some password" },
  });
  fireEvent.click(screen.getByText("Log in"));
  await new Promise((r) => setTimeout(r, 100));

  await expect(mockSetCreds).toHaveBeenCalledTimes(1);
});

test("Login navigate fail", async () => {
  const mockSetCreds = jest.fn();
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester", firstname: "tester" },
          setCredentials: mockSetCreds,
        }}
      >
        <Login />
      </AuthUserContext.Provider>
    </Router>
  );
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "some username" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "some incorrect password" },
  });
  fireEvent.click(screen.getByText("Log in"));
  await expect(mockSetCreds).toHaveBeenCalledTimes(0);
  await new Promise((r) => setTimeout(r, 100));

  expect(screen.getByText("incorrect password")).toBeInTheDocument();
});

test("Login click forgot password", async () => {
  const mockAlert = jest.fn();
  window.alert = mockAlert;
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester", firstname: "tester" },
        }}
      >
        <Login />
      </AuthUserContext.Provider>
    </Router>
  );
  fireEvent.click(screen.getByText("Forgot password?"));
  await expect(mockAlert).toHaveBeenCalledTimes(1);
});

test("Login navigate to signup", async () => {
  render(
    <Router>
      <AuthUserContext.Provider value={{}}>
        <Login />
      </AuthUserContext.Provider>
    </Router>
  );
  fireEvent.click(screen.getByText("Sign up"));
  await expect(mockedUsedNavigate).toHaveBeenCalledWith("/signup");
});
