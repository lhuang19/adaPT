import React, { useState, useContext, useEffect } from "react";
import { List, Layout, Menu, Form, Input, Button } from "antd";
import Message from "../Message/Message";
import { doAPIRequest } from "../../modules/api";
import { AuthUserContext } from "../../context/Auth";

function Chat() {
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;
  const [otherUser, setOtherUser] = useState("sherie"); // hard code this for now
  const [messages, setMessages] = useState([]);
  const { Content, Sider, Footer } = Layout;
  const { TextArea } = Input;
  const [input, setInput] = useState("");

  async function fetchNewMessages() {
    const { data } = await doAPIRequest(
      `/chat/${credentials.username}/${otherUser}`,
      {
        method: "GET",
      }
    );
    setMessages(data);
  }

  useEffect(() => {
    // if (username !== undefined && otherUser !== undefined) {
    fetchNewMessages();
    const periodicRefresh = setInterval(async () => {
      fetchNewMessages();
    }, 100000);
    return () => clearInterval(periodicRefresh);
    // }
  }, []);

  // temporary, need to change to actual friends
  const menuItems = ["1", "2", "3"].map((key) => ({
    key,
    label: `friend ${key}`,
  }));

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
    // const current = [...messages];
    // current.push({
    //   body: input,
    //   time: Date.now(),
    //   sender: credentials.username,
    //   receiver: otherUser,
    // });
    // setMessages(current);
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
                    <List.Item
                      key={`${message.sender.username}-${message.time}`}
                    >
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
          <Footer style={{ position: "sticky", bottom: "0" }}>
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
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default Chat;
