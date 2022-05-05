import React, { useState, useContext, useEffect, useRef } from "react";
import { List, Layout, Menu, Form, Input, Button, notification } from "antd";
import Message from "../Message/Message";
import { doAPIRequest } from "../../modules/api";
import { AuthUserContext } from "../../context/Auth";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Chat() {
  const { credentials } = useContext(AuthUserContext);
  const { username, firstname } = credentials;
  const [menuItems, setMenuItems] = useState([]);
  const [currChattingUser, setCurrChattingUser] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [currMessages, setCurrMessages] = useState([]);
  const { Content, Sider } = Layout;
  const { TextArea } = Input;
  const [input, setInput] = useState("");

  async function fetchNewMessages(notifications) {
    if (username.length > 0 && currChattingUser !== undefined) {
      const { data } = await doAPIRequest(`/chat/${credentials.username}`, {
        method: "GET",
      });

      if (notifications && data.length > allMessages.length) {
        notification.open({
          message: "adaPT",
          description: "You have new messages!",
          duration: 3000,
        });
      }
      setAllMessages(data);
      setCurrMessages(
        allMessages.filter(
          (message) =>
            (message.sender === username &&
              message.receiver === currChattingUser) ||
            (message.sender === currChattingUser &&
              message.receiver === username)
        )
      );
    }
  }
  useEffect(() => {
    fetchNewMessages(false);
  }, [username, currChattingUser]);
  useInterval(async () => {
    fetchNewMessages(true);
  }, 1000);
  setTimeout(() => {
    var element = document.getElementById("scrollable");
    element.scrollTop = element.scrollHeight;
  }, 100);
  // useEffect(() => {
  //   var element = document.getElementById("scrollable");
  //   element.scrollTop = element.scrollHeight;
  // }, [currMessages, currChattingUser]);

  async function getFriends() {
    if (username.length > 0) {
      const { data } = await doAPIRequest(`/user/${username}`, {
        method: "GET",
      });
      const friendList = data.friends;
      friendList.filter((friend) => friend !== username);
      const items = friendList.map((name) => ({ key: name, label: name }));
      setMenuItems(items);
      if (friendList.length > 0) {
        setCurrChattingUser(items[0].key);
      }
    }
  }
  useEffect(() => {
    getFriends();
  }, [username]);

  function onSendMessageHandler() {
    const time = Date.now();
    doAPIRequest(`/chat`, {
      method: "POST",
      body: {
        body: input,
        time,
        sender: username,
        receiver: currChattingUser,
        senderFirstname: firstname,
      },
    });
    // optimistic UI. Assume the message sends and update UI right away.
    setCurrMessages([
      ...currMessages,
      {
        body: input,
        time,
        sender: username,
        receiver: currChattingUser,
        senderFirstname: firstname,
      },
    ]);
    setAllMessages([
      ...allMessages,
      {
        body: input,
        time,
        sender: username,
        receiver: currChattingUser,
        senderFirstname: firstname,
      },
    ]);
    setInput("");
  }

  return (
    <Layout style={{ height: "100%", width: "100%" }}>
      <Sider
        style={{
          overflow: "auto",
          height: "100%",
        }}
      >
        <Menu
          height="100%"
          theme="light"
          mode="inline"
          selectedKeys={[currChattingUser]}
          items={menuItems}
          onSelect={(e) => {
            console.log(e.key);
            setCurrChattingUser(e.key);
            setCurrMessages([]);
          }}
        />
      </Sider>
      <Layout>
        <Content
          id="scrollable"
          className="site-layout-background"
          style={{
            overflow: "auto",
          }}
        >
          <List
            dataSource={currMessages}
            renderItem={(message) => (
              <List.Item key={`${message.sender}-${message.time}`}>
                <Message data={message} />
              </List.Item>
            )}
          />
          {/* <Messages currUser={username} otherUser={otherUser} /> */}
        </Content>
        <div
          style={{
            lineHeight: 10,
          }}
        >
          <br></br>
        </div>
        <div
          style={{
            position: "fixed",
            bottom: "0",
            width: "100%",
            backgroundColor: "#f0f2f5",
            overflow: "auto",
          }}
        >
          <br></br>
          <Form.Item>
            <TextArea
              autoSize={{ minRows: 1, maxRows: 3 }}
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </Form.Item>

          <Form.Item
            style={{
              marginBottom: "0px",
              paddingBottom: "0px",
            }}
          >
            <Button
              htmlType="submit"
              onClick={() => onSendMessageHandler()}
              type="primary"
            >
              Send
            </Button>
          </Form.Item>
          <br></br>
        </div>
      </Layout>
    </Layout>
  );
}

export default Chat;
