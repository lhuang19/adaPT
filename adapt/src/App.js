import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import PageNotFound from "./components/ErrorPage/PageNotFound";
import "antd/dist/antd.min.css";
import "./App.css";
import { WithAuth } from "./context/Auth";

function App() {
  return (
    <WithAuth>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </WithAuth>
  );
}

export default App;
