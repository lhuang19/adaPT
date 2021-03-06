import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import PageNotFound from "./components/ErrorPage/PageNotFound";
import Profile from "./components/Profile/Profile";
import Chat from "./components/Chat/Chat";
import ExercisePage from "./components/Exercises/ExercisePage";
import ChangeProfile from "./components/Profile/ChangeProfile";
import "antd/dist/antd.min.css";
import "rc-texty/assets/index.css";
import "./App.css";
import { WithAuth } from "./context/Auth";

function App() {
  return (
    <div style={{ minWidth: "650px" }}>
      <WithAuth>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:name" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/exercises" element={<ExercisePage />} />
          <Route path="/change_profile/:name" element={<ChangeProfile />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </WithAuth>
    </div>
  );
}

export default App;
