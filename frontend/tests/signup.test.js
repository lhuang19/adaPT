/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthUserContext } from "../src/context/Auth";
import Signup from "../src/components/Signup/Signup";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not...I'm not depending on the results so no need to put in a return value
}));

test("Signup navigate to login", async () => {
  render(
    <Router>
      <AuthUserContext.Provider value={{}}>
        <Signup />
      </AuthUserContext.Provider>
    </Router>
  );

  fireEvent.click(screen.getByText("Log in"));
  await expect(mockedUsedNavigate).toHaveBeenCalledWith("/login");
});

test("Signup next and prev", async () => {
  const mockSetCreds = jest.fn();

  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          setCredentials: mockSetCreds,
        }}
      >
        <Signup />
      </AuthUserContext.Provider>
    </Router>
  );
  fireEvent.click(screen.getByText("Next"));
  await new Promise((r) => setTimeout(r, 200));

  expect(screen.getByText("Please create a username!")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "username1" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "password" },
  });
  fireEvent.click(screen.getByText("Next"));
  await new Promise((r) => setTimeout(r, 1000));
  expect(screen.getByText("First Name")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Previous"));
  await new Promise((r) => setTimeout(r, 1000));
  expect(screen.getByDisplayValue("username1")).toBeInTheDocument();
}, 10000);

test("Signup submit", async () => {
  const mockSetCreds = jest.fn();

  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          setCredentials: mockSetCreds,
        }}
      >
        <Signup />
      </AuthUserContext.Provider>
    </Router>
  );
  fireEvent.click(screen.getByText("Next"));
  await new Promise((r) => setTimeout(r, 100));

  expect(screen.getByText("Please create a username!")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "username1" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "password" },
  });
  fireEvent.click(screen.getByText("Next"));
  await new Promise((r) => setTimeout(r, 500));
  fireEvent.change(screen.getByLabelText("First Name"), {
    target: { value: "L" },
  });
  fireEvent.change(screen.getByLabelText("Last Name"), {
    target: { value: "H" },
  });
  fireEvent.click(screen.getByText("Next"));
  await new Promise((r) => setTimeout(r, 500));

  fireEvent.click(screen.getByLabelText("PT"));
  fireEvent.click(screen.getByText("Sign up"));
  await new Promise((r) => setTimeout(r, 100));
  expect(screen.getByText("test message")).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText("Patient"));
  fireEvent.click(screen.getByText("Sign up"));
  await new Promise((r) => setTimeout(r, 500));

  fireEvent.click(screen.getByText("Login"));
  await expect(mockedUsedNavigate).toHaveBeenCalledWith("/login");

  fireEvent.click(screen.getByText("Go to Home"));
  await expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
}, 10000);
