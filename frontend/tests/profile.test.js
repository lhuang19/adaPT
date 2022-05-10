/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthUserContext } from "../src/context/Auth";
import { mockedDoAPIRequest } from "./setupTests";

import Profile from "../src/components/Profile/Profile";

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
  useParams: jest.fn().mockReturnValue({ name: "tester" }),
}));

test("Profile add friend", async () => {
  const mockSetCreds = jest.fn();
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester2" },
          setCredentials: mockSetCreds,
        }}
      >
        <Profile />
      </AuthUserContext.Provider>
    </Router>
  );
  await new Promise((r) => setTimeout(r, 100));
  fireEvent.click(screen.getByText("Request Friend"));

  expect(screen.getByText("Request Friend")).toBeInTheDocument();
});

test("Profile remove friend", async () => {
  const mockSetCreds = jest.fn();
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester3" },
          setCredentials: mockSetCreds,
        }}
      >
        <Profile />
      </AuthUserContext.Provider>
    </Router>
  );
  await new Promise((r) => setTimeout(r, 100));
  fireEvent.click(screen.getByText("Remove Friend"));
  await waitFor(() =>
    expect(mockedDoAPIRequest).toHaveBeenCalledWith(
      "/profile/friend/tester3/tester",
      {
        method: "DELETE",
      }
    )
  );
  await waitFor(() =>
    expect(screen.getByText("Request Friend")).toBeInTheDocument()
  );
});

test("Profile requested friend", async () => {
  const mockSetCreds = jest.fn();
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester4" },
          setCredentials: mockSetCreds,
        }}
      >
        <Profile />
      </AuthUserContext.Provider>
    </Router>
  );
  await new Promise((r) => setTimeout(r, 100));
  fireEvent.click(screen.getByText("Requested Friend"));

  expect(screen.getByText("Requested Friend")).toBeInTheDocument();
});

test("Profile accept friend", async () => {
  const mockSetCreds = jest.fn();
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester5" },
          setCredentials: mockSetCreds,
        }}
      >
        <Profile />
      </AuthUserContext.Provider>
    </Router>
  );
  await new Promise((r) => setTimeout(r, 100));
  fireEvent.click(screen.getByText("Accept"));
  await waitFor(() =>
    expect(mockedDoAPIRequest).toHaveBeenCalledWith(
      "/profile/friendRequest/tester/tester5",
      {
        method: "DELETE",
      }
    )
  );
  await waitFor(() =>
    expect(mockedDoAPIRequest).toHaveBeenCalledWith(
      "/profile/friend/tester/tester5",
      {
        method: "POST",
      }
    )
  );
  await waitFor(() =>
    expect(screen.getByText("Remove Friend")).toBeInTheDocument()
  );
});

test("Profile decline friend", async () => {
  const mockSetCreds = jest.fn();
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester5" },
          setCredentials: mockSetCreds,
        }}
      >
        <Profile />
      </AuthUserContext.Provider>
    </Router>
  );
  await new Promise((r) => setTimeout(r, 100));
  fireEvent.click(screen.getByText("Decline"));
  await waitFor(() =>
    expect(mockedDoAPIRequest).toHaveBeenCalledWith(
      "/profile/friendRequest/tester/tester5",
      {
        method: "DELETE",
      }
    )
  );
  await waitFor(() =>
    expect(screen.getByText("Request Friend")).toBeInTheDocument()
  );
});

test("Profile navigate to Change Profile", async () => {
  render(
    <Router>
      <AuthUserContext.Provider
        value={{
          credentials: { username: "tester", firstname: "tester" },
        }}
      >
        <Profile />
      </AuthUserContext.Provider>
    </Router>
  );
  fireEvent.click(screen.getByText("Edit Profile"));
  await expect(mockedUsedNavigate).toHaveBeenCalledWith(
    "/change_profile/tester"
  );
});
