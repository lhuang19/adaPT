import React, { useState, useContext, useEffect } from "react";
import { List } from "antd";
// import { Parallax } from "rc-scroll-anim";
import { AuthUserContext } from "../../context/Auth";
import { doAPIRequest } from "../../modules/api";
import Message from "./Message";

function Messages({ currUser, otherUser }) {
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;

  const [messages, setMessages] = useState([]);

  async function fetchNewMessages() {
    const { data } = await doAPIRequest(
      `/chat/${credentials.username}/${otherUser}`,
      {
        method: "GET",
      }
    );
    setMessages(data);
  }
  // useEffect(() => {
  //   if (username !== undefined && otherUser !== undefined) fetchNewMessages();
  // }, [otherUser]);

  useEffect(() => {
    // if (username !== undefined && otherUser !== undefined) {
      fetchNewMessages();
      const periodicRefresh = setInterval(async () => {
        fetchNewMessages();
      }, 100000);
      return () => clearInterval(periodicRefresh);
    // }
  }, []);

  return (
    <List
      style={{ width: "80%" }}
      dataSource={messages}
      renderItem={(message) => (
        <List.Item key={`${message.sender.username}-${message.time}`}>
          <Message data={message} />
        </List.Item>
      )}
    />
  );
}

export default Messages;
