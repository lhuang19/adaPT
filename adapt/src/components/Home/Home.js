import React, { useState, useContext, useEffect } from "react";
import { List } from "antd";
import { Parallax } from "rc-scroll-anim";
import Post from "../Post/Post";
import { getPosts } from "../../modules/storage";
import { AuthUserContext } from "../../context/Auth";
import LandingScreen from "./LandingScreen";
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
    <div style={{ background: "white" }}>
      <LandingScreen />
      <div style={{ margin: "auto", display: "block", width: "80%" }}>
        <List
          dataSource={posts}
          renderItem={(post) => (
            <List.Item key={`${post.title}-${post.time}`}>
              <Parallax
                animation={[
                  { y: 0, opacity: 1, scale: 1, playScale: [-0.3, 0.5] },
                  {
                    translateY: -100,
                    opacity: 0,
                    scale: 0,
                    playScale: [0.4, 0.9],
                  },
                ]}
                style={{
                  transform: "translateY(100px) scale(0)",
                  opacity: 0,
                }}
              >
                <Post data={post} animate />
              </Parallax>
            </List.Item>
          )}
        />
        <div style={{ height: "150px" }} />
      </div>

      <PostModal fetchNewPosts={() => fetchNewPosts()} />
    </div>
  );
}

export default Home;
