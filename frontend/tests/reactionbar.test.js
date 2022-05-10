/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthUserContext } from "../src/context/Auth";

import ReactionBar from "../src/components/Posts/ReactionBar/ReactionBar";
import { mockedDoAPIRequest } from "./setupTests";

jest.useFakeTimers();

test("test interval", async () => {
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester", firstname: "tester" },
        }}
      >
        <ReactionBar poster="tester" time={1} username="tester" />
      </AuthUserContext.Provider>
    </Router>
  );
  expect(mockedDoAPIRequest).toHaveBeenCalledTimes(1);
  await waitFor(() =>
    expect(screen.getByTestId("reaction-bar")).toBeInTheDocument()
  );
  jest.advanceTimersByTime(15000);
  expect(mockedDoAPIRequest).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(15000);
  expect(mockedDoAPIRequest).toHaveBeenCalledTimes(2);
});

test("test no user", async () => {
  const { container } = render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester", firstname: "tester" },
        }}
      >
        <ReactionBar poster="tester" time={1} />
      </AuthUserContext.Provider>
    </Router>
  );

  expect(container.innerHTML).toHaveLength(0);
});
