import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

function Message(props) {
  const { data } = props;
  const { body, time, sender, receiver} = data;

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
        <Avatar size={64} icon={<UserOutlined />} alt={sender.concat("'s profile picture")}/>
        <div
          style={{
            paddingLeft: "1vw",
          }}
        >
          {/* need to make receiver a user object and not string username from chat.js */}
          <p>{sender.firstname}</p>
          <p>{new Date(time).toLocaleString()}</p>
          {
            // TODO Format timestamp better
          }
        </div>
      </div>
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
