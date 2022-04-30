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
  const [otherUser, setOtherUser] = useState("sherie"); // hard code this for now
  const [messages, setMessages] = useState([]);
  const { Content, Sider, Footer } = Layout;
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
          <Footer style={{ position: "sticky", bottom: "0" }}>
            <Form.Item>
              <TextArea
                autoSize={{ minRows: 1, maxRows: 6 }}
                onChange={(e) => setInput(e.target.value)}
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
          </Footer>
        </Layout>
      </Layout>
      {/* <MessageModal fetchNewMessages={() => fetchNewMessages()} /> */}
    </div>
  );
}

export default Chat;
