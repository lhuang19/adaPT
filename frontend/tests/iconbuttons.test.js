/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthUserContext } from "../src/context/Auth";
import { mockedDoAPIRequest } from "./setupTests";

import IconButton from "../src/components/Posts/ReactionBar/IconButtons";

test("icon button DELETE", async () => {
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester", firstname: "tester" },
        }}
      >
        <IconButton
          poster="tester"
          time={1}
          username="tester"
          icon={<div />}
          name="L"
          selectedColor="#00000"
          initialState
          count={10}
        />
      </AuthUserContext.Provider>
    </Router>
  );
  fireEvent.click(screen.getByTestId("icon-button"));
  await waitFor(() => expect(mockedDoAPIRequest).toHaveBeenCalledTimes(1));
  await expect(mockedDoAPIRequest).toHaveBeenCalledWith(
    "/post/tester1/reactions/tester/L",
    { method: "DELETE" }
  );
});

test("icon button POST", async () => {
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester", firstname: "tester" },
        }}
      >
        <IconButton
          poster="tester"
          time={1}
          username="tester"
          icon={<div />}
          name="L"
          selectedColor="#00000"
          count={10}
        />
      </AuthUserContext.Provider>
    </Router>
  );
  fireEvent.click(screen.getByTestId("icon-button"));
  await waitFor(() => expect(mockedDoAPIRequest).toHaveBeenCalledTimes(2));
  await expect(mockedDoAPIRequest).toHaveBeenCalledWith("/post/reactions", {
    method: "POST",
    body: {
      poster: "tester",
      time: 1,
      type: "L",
      username: "tester",
    },
  });
});
