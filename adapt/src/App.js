import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import "antd/dist/antd.css";
import "./App.css";
import { WithAuth } from "./context/Auth";

function App() {
  return (
    <WithAuth>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </WithAuth>
  );
}

export default App;
