import React, { useState, useContext, useEffect, useRef } from "react";
import { List, Layout, Menu, Form, Input, Button } from "antd";
import Message from "../Message/Message";
import { getMessages } from "../../modules/storage";
import { doAPIRequest } from "../../modules/api";
import { AuthUserContext } from "../../context/Auth";

// Should this be ./Chat/MessageModal?
import MessageModal from "./MessageModal";

function Chat() {
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;
  const [otherUser, setOtherUser] = useState(""); // the friend that current user is chatting with
  const [messages, setMessages] = useState([]);
  const { Content, Sider } = Layout;
  const { TextArea } = Input;
  const [input, setInput] = useState("");

  // temporary, need to change to actual friends
  const menuItems = ["1", "2", "3"].map((key) => ({
    key,
    label: `friend ${key}`,
  }));

  // async function fetchNewMessages() {
  //   const newMessages = await getMessages(username);
  //   setMessages(newMessages);
  // }
  // useEffect(() => {
  //   if (username !== undefined) fetchNewMessages();
  // }, [username]);

  function onSendMessageHandler() {
    doAPIRequest(`/chat`, {
      method: "POST",
      body: {
        body: input,
        time: Date.now(),
        sender: credentials.username,
        receiver: otherUser,
      },
    });
    const current = [...messages];
    current.push({
      body: input,
      time: Date.now(),
      sender: credentials.username,
      receiver: otherUser,
    });
    setMessages(current);
    setInput("");
  }
  useEffect(() => {
    async function makeAPIRequest() {
      const { data } = await doAPIRequest(`/chat`, {
        method: "GET",
        body: { currUser: credentials.username, otherUser },
      });
      setMessages(data);
    }
    makeAPIRequest();
  }, []);

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
              defaultSelectedKeys={["1"]}
              items={menuItems}
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
              }}
            >
              <div
                className="site-layout-background"
                style={{
                  padding: 24,
                }}
              >
                Messages to appear here
                {/* <List
        style={{ width: "80%" }}
        dataSource={messages}
        renderItem={(message) => (
          <List.Item>
            <Message key={`${message.time}`} data={message} />
          </List.Item>
        )}
      /> */}
              </div>
            </Content>
            <Form.Item>
              <TextArea onChange={(e) => setInput(e.target.value)} />
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
          </Layout>
        </Layout>
      </Layout>
      {/* <MessageModal fetchNewMessages={() => fetchNewMessages()} /> */}
    </div>
  );
}

export default Chat;
