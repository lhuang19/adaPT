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
  const [messages, setMessages] = useState([]);
  const { Content, Sider, Footer } = Layout;
  const { TextArea } = Input;
  const [input, setInput] = useState("");

  async function fetchNewMessages(notifications) {
    if (username.length > 0 && currChattingUser !== undefined) {
      const { data } = await doAPIRequest(
        `/chat/${credentials.username}/${currChattingUser}`,
        {
          method: "GET",
        }
      );

      if (notifications && data.length > messages.length) {
        notification.open({
          message: "adaPT",
          description: "New Messages Loaded!",
          duration: 3000,
        });
      }
      setMessages(data);
    }
  }
  useEffect(() => {
    fetchNewMessages(false);
  }, [username, currChattingUser]);
  useInterval(async () => {
    fetchNewMessages(true);
  }, 10000);

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
    setMessages([
      ...messages,
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
        minWidth: "100%",
      }}
    >
      <Layout>
        <Layout hasSider>
          <Sider
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[currChattingUser]}
              items={menuItems}
              onSelect={(e) => {
                console.log(e.key);
                setCurrChattingUser(e.key);
                setMessages([]);
              }}
            />
          </Sider>
          <Layout
            style={{
              padding: "0 24px 24px",
              marginLeft: 200,
            }}
          >
            <Content
              className="site-layout-background"
              style={{
                margin: "24px 16px 0",
                overflow: "initial",
                // minHeight: "80vh",
              }}
            >
              <div
                className="site-layout-background"
                style={{
                  padding: 24,
                }}
              >
                <List
                  style={{ width: "80%" }}
                  dataSource={messages}
                  renderItem={(message) => (
                    <List.Item key={`${message.sender}-${message.time}`}>
                      <Message data={message} />
                    </List.Item>
                  )}
                />
              </div>
            </Content>
          </Layout>
        </Layout>
        <Layout
          style={{
            padding: "0 24px 24px",
            marginLeft: 200,
          }}
        >
          <div
            style={{
              position: "fixed",
              bottom: "0",
              width: "60%",
              backgroundColor: "#f0f2f5",
            }}
          >
            <Form.Item>
              <TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
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
    </div>
  );
}

export default Chat;
