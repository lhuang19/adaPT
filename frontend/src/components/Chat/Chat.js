import React, { useState, useContext, useEffect } from "react";
import { List } from "antd";
import Message from "../Message/Message";
import { getMessages } from "../../modules/storage";
import { doAPIRequest } from "../../modules/api";
import { AuthUserContext } from "../../context/Auth";

// Should this be ./Chat/MessageModal?
import MessageModal from "./MessageModal";

function Chat() {
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;
  const [messages, setMessages] = useState([]);
  async function fetchNewMessages() {
    const newMessages = await getMessages(username);
    setMessages(newMessages);
    // const messagesToFetch = [];
    // messagesToFetch.push(profile ? name : username);
    // if (!profile) {
    //   const friends = await getFriends(username);
    //   usernamesToFetch.push(...friends);
    // }
    // const { data } = await doAPIRequest("/post/feed", {
    //   method: "POST",
    //   body: messagesToFetch,
    // });
    // setMessages(data);
  }
  useEffect(() => {
    if (username !== undefined) fetchNewMessages();
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
        dataSource={messages}
        renderItem={(message) => (
          <List.Item>
            <Message key={`${message.title}-${message.time}`} data={message} />
          </List.Item>
        )}
      />
      <MessageModal fetchNewMessages={() => fetchNewMessages()} />
    </div>
  );
}

export default Chat;
