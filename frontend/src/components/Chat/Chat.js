import React, { useState, useContext, useEffect } from "react";
import { List, Layout, Menu } from "antd";
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
  const { Content, Sider } = Layout;
  // temporary, need to change to actual friends
  const menuItems = ["1", "2", "3"].map((key) => ({
    key,
    label: `friend ${key}`,
  }));
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
      {/* <List
        style={{ width: "80%" }}
        dataSource={messages}
        renderItem={(message) => (
          <List.Item>
            <Message key={`${message.title}-${message.time}`} data={message} />
          </List.Item>
        )}
      /> */}
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
              theme="dark"
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
                Content
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <MessageModal fetchNewMessages={() => fetchNewMessages()} />
    </div>
  );
}

export default Chat;
