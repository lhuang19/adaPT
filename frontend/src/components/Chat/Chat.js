import React, { useState, useContext, useEffect } from "react";
import { List, Layout, Menu, Form, Input, Button } from "antd";
import Message from "../Message/Message";
import { doAPIRequest } from "../../modules/api";
import { AuthUserContext } from "../../context/Auth";

function Chat() {
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;
  const [friends, setFriends] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [currChattingUser, setCurrChattingUser] = useState("sinas"); // hard code this for now
  const [messages, setMessages] = useState([]);
  const { Content, Sider, Footer } = Layout;
  const { TextArea } = Input;
  const [input, setInput] = useState("");

  async function fetchNewMessages() {
    if (username !== undefined && currChattingUser !== undefined) {
      const { data } = await doAPIRequest(
        `/chat/${credentials.username}/${currChattingUser}`,
        {
          method: "GET",
        }
      );
      setMessages(data);
    }
  }
  useEffect(() => {
    fetchNewMessages();
    const periodicRefresh = setInterval(async () => {
      fetchNewMessages();
    }, 100);
    return () => clearInterval(periodicRefresh);
  }, [messages]);

  async function getFriends() {
    if (username !== undefined && currChattingUser !== undefined) {
      const { data } = await doAPIRequest(`/user/${credentials.username}`, {
        method: "GET",
      });
      setFriends(data.friends);
    }
  }
  useEffect(() => {
    getFriends();
    console.log(friends);
    const items = friends.map((name) => ({ key: name, label: name }));
    setMenuItems(items);
    console.log(menuItems);
  }, [messages]);

  function onSendMessageHandler() {
    doAPIRequest(`/chat`, {
      method: "POST",
      body: {
        body: input,
        time: Date.now(),
        sender: credentials.username,
        receiver: currChattingUser,
        senderFirstname: credentials.firstname,
      },
    });
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
              // defaultSelectedKeys={["1"]}
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
                {/* <Messages currUser={username} otherUser={otherUser} /> */}
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
