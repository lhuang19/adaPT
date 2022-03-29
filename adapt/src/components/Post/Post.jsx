import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Parallax } from "rc-scroll-anim";

function Post(props) {
  const { data, animate } = props;
  const { title, body, time, poster } = data;
  // post is JSON with username, timestamp, text, and imageURL
  // const { username, timestamp, text, imageURL } = post;
  return animate ? (
    <div
      style={{
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
          <Avatar size={64} icon={<UserOutlined />} />
        </Parallax>
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
            <h2>{poster} </h2>
            <p>{new Date(time).toLocaleString()}</p>
          </div>
        </Parallax>
      </div>
      <h3>
        <b>{title}</b>
      </h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{body}</p>
      {/* {imageURL.length > 0 ? (
      <img src={imageURL} alt={"A post from ".concat(username)} />
    ) : null} */}
      {
        // TODO Figure out how to make image fit neatly in div
      }
    </div>
  ) : (
    <div
      style={{
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
        <Avatar size={64} icon={<UserOutlined />} />

        <div
          style={{
            paddingLeft: "1vw",
          }}
        >
          <h2>{poster} </h2>
          <p>{new Date(time).toLocaleString()}</p>
        </div>
      </div>
      <h3>
        <b>{title}</b>
      </h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{body}</p>
      {/* {imageURL.length > 0 ? (
      <img src={imageURL} alt={"A post from ".concat(username)} />
    ) : null} */}
      {
        // TODO Figure out how to make image fit neatly in div
      }
    </div>
  );
}

export default Post;
