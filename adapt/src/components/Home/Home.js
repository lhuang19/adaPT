import React from "react";
import LandingScreen from "./LandingScreen";
import Posts from "../Posts/Posts";

function Home() {
  return (
    <div style={{ background: "white" }}>
      <LandingScreen />
      <div style={{ margin: "auto", display: "block", width: "80%" }}>
        <Posts animate allowPosting />
        <div style={{ height: "150px" }} />
      </div>
    </div>
  );
}

export default Home;
