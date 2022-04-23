import React, { useContext } from "react";
import { Avatar, Button } from "antd";

import { Parallax } from "rc-scroll-anim";
import { AuthUserContext } from "../../context/Auth";

import { doAPIRequest } from "../../modules/api";
import ReactionBar from "./ReactionBar/ReactionBar";
import Comments from "./Comments/Comments";

function Post(props) {
  const { data, animate, fetchNewPosts } = props;
  const { title, body, time, poster, users } = data;
  const { firstname, lastname } = users;
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          paddingBottom: "1vw",
        }}
      >
        {animate ? (
          <Parallax
            animation={[
              { x: 20, opacity: 1, playScale: [0, 0.2] },
              { x: 0, opacity: 1, playScale: [0, 0.1] },
            ]}
            style={{
              transform: "translateX(-100px)",
              opacity: 0,
            }}
            className="code-box-shape"
          >
            <Avatar size={64} src={`https://joeschmoe.io/api/v1/${poster}`} />
          </Parallax>
        ) : (
          <Avatar size={64} src={`https://joeschmoe.io/api/v1/${poster}`} />
        )}
        {animate ? (
          <Parallax
            animation={[
              { x: -20, opacity: 1, playScale: [0, 0.2] },
              { x: 0, opacity: 1, playScale: [0, 0.1] },
            ]}
            style={{
              transform: "translateX(100px)",
              opacity: 0,
            }}
            className="code-box-shape"
          >
            <div
              style={{
                paddingLeft: "1vw",
              }}
            >
              <h2>
                <b>
                  {firstname} {lastname}
                </b>

                <span style={{ fontSize: "10px", color: "grey" }}>
                  &emsp;{poster}
                </span>
              </h2>
              <p>{new Date(time).toLocaleString()}</p>
            </div>
          </Parallax>
        ) : (
          <div
            style={{
              paddingLeft: "1vw",
            }}
          >
            <h2>{poster} </h2>
            <p>{new Date(time).toLocaleString()}</p>
          </div>
        )}
      </div>
      <h3>
        <b>{title}</b>
      </h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{body}</p>
      {username === poster ? (
        <div style={{ position: "absolute", right: "10px", top: "10px" }}>
          <Button
            danger
            onClick={async () => {
              await doAPIRequest("/post", {
                method: "DELETE",
                body: { poster, time },
              });
              fetchNewPosts();
            }}
          >
            Delete
          </Button>
        </div>
      ) : null}
      <ReactionBar poster={poster} time={time} username={username} />
      <Comments poster={poster} time={time} />
    </div>
  );
}

export default Post;
