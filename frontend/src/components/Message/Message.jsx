import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

function Message(props) {
  const { data } = props;
  const { title, body, time, poster, recipient } = data;

  // post is JSON with username, timestamp, text, and imageURL
  // const { username, timestamp, text, imageURL } = post;
  return (
    <div
      style={{
        maxWidth: "80vw",
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
        <Avatar size={64} icon={<UserOutlined />} alt={poster.concat("'s profile picture")}/>
        <div
          style={{
            paddingLeft: "1vw",
          }}
        >
          <h2>From: {poster} </h2>
          <p>{new Date(time).toLocaleString()}</p>
          {
            // TODO Format timestamp better
          }
        </div>
      </div>
      <h3><b>{title}</b></h3>
      <p style={{whiteSpace: "pre-wrap"}}>{body}</p>
      {/* {imageURL.length > 0 ? (
        <img src={imageURL} alt={"A post from ".concat(username)} />
      ) : null} */}
      {
        // TODO Figure out how to make image fit neatly in div
      }
    </div>
  );
}

export default Message;
