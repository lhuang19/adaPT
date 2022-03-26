import React, { useState, useContext, useEffect } from "react";
import { List } from "antd";
import { Parallax } from "rc-scroll-anim";
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
            <Parallax
              animation={{ x: 0, opacity: 1, playScale: [0.25, 0.5] }}
              style={{ transform: "translateX(-100px)", opacity: 0 }}
              className="code-box-shape"
            >
              <Post key={`${post.title}-${post.time}`} data={post} />
            </Parallax>
          </List.Item>
        )}
      />
      <PostModal fetchNewPosts={() => fetchNewPosts()} />
    </div>
  );
}

export default Home;
