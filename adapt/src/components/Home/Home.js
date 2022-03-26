import React, { useState, useContext, useEffect } from "react";
import { List } from "antd";
import Post from "../Post/Post";
import { getPosts } from "../../modules/storage";
import { AuthUserContext } from "../../context/Auth";
import PostModal from "./PostModal";

function Home() {
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;
  const [posts, setPosts] = useState([]);
  async function fetchNewPosts() {
    const newPosts = await getPosts(username);
    setPosts(newPosts);
  }
  useEffect(() => {
    if (username !== undefined) fetchNewPosts();
  }, [username]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
        minWidth: "100%",
      }}
    >
      <List
        style={{ width: "80%" }}
        dataSource={posts}
        renderItem={(post) => (
          <List.Item>
            <Post key={`${post.title}-${post.time}`} data={post} />
          </List.Item>
        )}
      />
      <PostModal fetchNewPosts={() => fetchNewPosts()} />
    </div>
  );
}

export default Home;
