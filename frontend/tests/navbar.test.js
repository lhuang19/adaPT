/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthUserContext } from "../src/context/Auth";
import Navbar from "../src/components/NavBar/Navbar";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate, // Return an empty jest function to test whether it was called or not...I'm not depending on the results so no need to put in a return value
}));

test("NavBar navigate", async () => {
  render(
    <Router>
      <AuthUserContext.Provider
        value={{ credentials: { username: "tester", firstname: "tester" } }}
      >
        <Navbar credentials={{ username: "user", firstname: "first" }} />
      </AuthUserContext.Provider>
    </Router>
  );
  fireEvent.click(screen.getByTestId("chat_nav_bar"));
  await expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByTestId("exercise_nav_bar"));
  await expect(mockedUsedNavigate).toHaveBeenCalledTimes(2);
  fireEvent.click(screen.getByTestId("/_nav_bar"));
  await expect(mockedUsedNavigate).toHaveBeenCalledTimes(3);
});
