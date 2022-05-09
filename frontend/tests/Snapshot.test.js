/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthUserContext } from "../src/context/Auth";
import App from "../src/App";
import Login from "../src/components/Login/Login";
import Signup from "../src/components/Signup/Signup";
import LandingScreen from "../src/components/Home/LandingScreen";
import Navbar from "../src/components/NavBar/Navbar";
import Search from "../src/components/NavBar/Search";
import Post from "../src/components/Posts/Post";
import PostModal from "../src/components/Posts/PostModal";
import IconButton from "../src/components/Posts/ReactionBar/IconButtons";
import Profile from "../src/components/Profile/Profile";
import ChangeProfile from "../src/components/Profile/ChangeProfile";
import Posts from "../src/components/Posts/Posts";
import Chat from "../src/components/Chat/Chat";
import Message from "../src/components/Chat/Message";
import PageNotFound from "../src/components/ErrorPage/PageNotFound";
import Dashboard from "../src/components/Exercises/Dashboard";
import DashboardEntry from "../src/components/Exercises/DashboardEntry";
import Exercise from "../src/components/Exercises/Exercise";
import ExerciseModal from "../src/components/Exercises/ExerciseModal";
import ExercisePage from "../src/components/Exercises/ExercisePage";
import Exercises from "../src/components/Exercises/Exercises";

const componentsWithoutContext = [
  <App />,
  <Login />,
  <Signup />,
  <IconButton
    poster="some username"
    time={1}
    username="some username"
    icon={<div />}
    name="some name"
    selectedColor="#FFFFFF"
    count={1}
  />,
  <PageNotFound />,
];
const componentsWithContext = [
  <LandingScreen />,
  <Search />,
  <Search visible />,
  <Post
    data={{
      title: "some title",
      body: "some body",
      time: "some time",
      poster: "tester",
      users: {
        firstname: "some first",
        lastname: "some last",
      },
      media: "some media",
    }}
    fetchNewPosts={() => {}}
  />,
  <PostModal />,
  <Profile />,
  <ChangeProfile />,
  <Navbar credentials={{ username: "user", firstname: "first" }} />,
  <Posts profile="false" name="tester" allowPosting />,
  <Chat />,
  <Message
    data={{
      body: "somebody",
      time: 1652086434684,
      sender: "tester",
      senderFirstname: "John",
    }}
  />,
  <Dashboard name="tester" />,
  <Dashboard name="tester" animate />,
  <DashboardEntry
    data={{
      patient: { username: "tester", firstname: "Larry", lastname: "Huang" },
      setsCompleted: 1,
      totalSets: 10,
    }}
    animate
  />,
  <DashboardEntry
    data={{
      patient: { username: "tester", firstname: "Larry", lastname: "Huang" },
      setsCompleted: 1,
      totalSets: 10,
    }}
    animate
  />,
  <Exercise
    data={{
      name: "tester",
      sets: 10,
      reps: 5,
      instructions: "something",
      setsCompleted: 2,
      patient: "tester",
      pt: "TonyPT",
      creationTime: 1,
    }}
  />,
  <ExerciseModal />,
  <ExercisePage />,
  <Exercises name="tester" />,
  <Exercises name="animate" />,
];

let container = null;
let root = null;
let mockDate;

beforeEach(() => {
  container = document.createElement("div");
  root = createRoot(container);
  document.body.appendChild(container);
  mockDate = jest
    .spyOn(Date.prototype, "toLocaleString")
    .mockReturnValue("2020-04-15");
});
afterEach(() => {
  root.unmount();
  container.remove();
  container = null;
  mockDate.mockRestore();
});

describe("snapshot tests", () => {
  test("Login wrong entry", async () => {
    const { asFragment } = render(
      <Router>
        <Login />
      </Router>
    );
    fireEvent.click(screen.getByText("Log in"));
    await new Promise((r) => setTimeout(r, 100));
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText("Please input your username!")).toBeInTheDocument();
  });

  test("Post Modal click", async () => {
    const { asFragment } = render(
      <Router>
        <AuthUserContext.Provider
          value={{ credentials: { username: "tester" } }}
        >
          <PostModal />
        </AuthUserContext.Provider>
      </Router>
    );
    fireEvent.click(screen.getByTestId("post-modal-button"));
    await new Promise((r) => setTimeout(r, 100));
    expect(asFragment()).toMatchSnapshot();
  });

  test("Exercise Modal click", async () => {
    const { asFragment } = render(
      <Router>
        <AuthUserContext.Provider
          value={{ credentials: { username: "tester" } }}
        >
          <ExerciseModal />
        </AuthUserContext.Provider>
      </Router>
    );
    fireEvent.click(screen.getByTestId("exercise-modal-button"));
    await new Promise((r) => setTimeout(r, 100));
    expect(asFragment()).toMatchSnapshot();
  });

  componentsWithoutContext.forEach((element, index) =>
    test(`Test w/o context: ${index}`, () => {
      const { asFragment } = render(<Router>{element}</Router>);
      expect(asFragment()).toMatchSnapshot();
    })
  );
  componentsWithContext.forEach((element, index) =>
    test(`Test w/ context: ${index}`, () => {
      const { asFragment } = render(
        <Router>
          <AuthUserContext.Provider
            value={{ credentials: { username: "tester", role: "PT" } }}
          >
            {element}
          </AuthUserContext.Provider>
        </Router>
      );
      expect(asFragment()).toMatchSnapshot();
    })
  );
});
