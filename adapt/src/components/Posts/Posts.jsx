import React, { useState, useContext, useEffect } from "react";
import { List } from "antd";
import { Parallax } from "rc-scroll-anim";
import { AuthUserContext } from "../../context/Auth";

import { getPosts, getFriends } from "../../modules/storage";
import Post from "./Post";
import PostModal from "./PostModal";

function Posts({ profile, name, animate, allowPosting }) {
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;

  const [posts, setPosts] = useState([]);

  async function fetchNewPosts() {
    const usernamesToFetch = [];
    usernamesToFetch.push(profile ? name : username);
    if (!profile) {
      const friends = await getFriends(username);
      usernamesToFetch.push(...friends);
    }
    const newPosts = await getPosts(usernamesToFetch);
    setPosts(newPosts);
  }
  useEffect(() => {
    if (username !== undefined) fetchNewPosts();
  }, [username, name]);
  return (
    <>
      <List
        dataSource={posts}
        renderItem={(post) => (
          <List.Item key={`${post.title}-${post.time}`}>
            {animate ? (
              <Parallax
                animation={[
                  { y: 0, opacity: 1, scale: 1, playScale: [-0.3, 0.5] },
                ]}
                style={{
                  transform: "translateY(100px) scale(0)",
                  opacity: 0,
                  width: "100%",
                }}
              >
                <Post
                  data={post}
                  animate
                  fetchNewPosts={() => fetchNewPosts()}
                />
              </Parallax>
            ) : (
              <Post data={post} fetchNewPosts={() => fetchNewPosts()} />
            )}
          </List.Item>
        )}
      />
      {allowPosting ? (
        <PostModal fetchNewPosts={() => fetchNewPosts()} />
      ) : null}
    </>
  );
}

export default Posts;
