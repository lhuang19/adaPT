/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthUserContext } from "../src/context/Auth";
import { mockedDoAPIRequest } from "./setupTests";

import Comments from "../src/components/Posts/Comments/Comments";

jest.useFakeTimers();

test("comments create comment ", async () => {
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester", firstname: "tester" },
        }}
      >
        <Comments poster="tester" time="1" />
      </AuthUserContext.Provider>
    </Router>
  );
  fireEvent.click(screen.getByText("Comments"));
  await waitFor(() => expect(screen.getByText("Comment")).toBeInTheDocument());
  fireEvent.click(screen.getByText("Comment"));
  await waitFor(() =>
    expect(screen.getByText("Add Comment")).toBeInTheDocument()
  );
  fireEvent.change(screen.getByTestId("comment-textarea"), {
    target: { value: "new comment" },
  });
  await waitFor(() =>
    expect(screen.getByDisplayValue("new comment")).toBeInTheDocument()
  );

  jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));

  fireEvent.click(screen.getByText("Add Comment"));
  await waitFor(() =>
    expect(mockedDoAPIRequest).toHaveBeenCalledWith("/post/tester1/comments", {
      method: "POST",
      body: {
        commenter: "tester",
        content: "new comment",
        commentTime: 1577836800000,
      },
    })
  );
  jest.runAllTimers();
});
