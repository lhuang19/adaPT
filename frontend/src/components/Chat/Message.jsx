import React, { useContext } from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AuthUserContext } from "../../context/Auth";

function Message(props) {
  const { data } = props;
  const { body, time, sender, senderFirstname } = data;
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;

  if (username !== sender) {
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
          <Avatar
            size={64}
            icon={<UserOutlined />}
            alt={sender.concat("'s profile picture")}
            src={`https://joeschmoe.io/api/v1/${sender}`}
          />
          <div
            style={{
              paddingLeft: "1vw",
            }}
          >
            <p>{senderFirstname}</p>
            <p>{new Date(time).toLocaleString("en-US")}</p>
          </div>
        </div>
        <p style={{ whiteSpace: "pre-wrap" }}>{body}</p>
      </div>
    );
  }
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
          justifyContent: "right",
          alignItems: "center",
          paddingBottom: "1vw",
        }}
      >
        <Avatar
          size={64}
          icon={<UserOutlined />}
          alt={sender.concat("'s profile picture")}
          src={`https://joeschmoe.io/api/v1/${sender}`}
        />
        <div
          style={{
            paddingLeft: "1vw",
          }}
        >
          <p>{senderFirstname}</p>
          <p>{new Date(time).toLocaleString()}</p>
        </div>
      </div>
      <p align="right" style={{ whiteSpace: "pre-wrap" }}>
        {body}
      </p>
    </div>
  );
}

export default Message;
