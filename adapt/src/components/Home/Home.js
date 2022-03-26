import React from "react";
import Post from "../Post/Post";

function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
        minWidth: "100vw",
      }}
    >
      <Post postID={0} />
    </div>
  );
}

export default Home;
