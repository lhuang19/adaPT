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
  const otherUser = useRef(""); // the friend that current user is chatting with
  const [messages, setMessages] = useState([]);
  const { Content, Sider } = Layout;
  const { TextArea } = Input;
  const [input, setInput] = useState("");

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

  // THIS IS FROM COMMENTS: MODIFY THIS TO FIT MESSAGES
  // function onSendMessageHandler() {
  //   setInput("");
  //   const sendTime = Date.now();
  //   // postComment(poster, time, username, input, Date.now());
  //   doAPIRequest(`/post/${poster}${time}/comments`, {
  //     method: "POST",
  //     body: { commenter: username, content: input, commentTime: Date.now() },
  //   });
  //   const current = [...commentData];
  //   current.push({
  //     postid: poster + time,
  //     commenter: username,
  //     content: input,
  //     commentTime: submitTime,
  //     users: {
  //       firstname: credentials.firstname,
  //       lastname: credentials.lastname,
  //     },
  //   });
  //   setCommentData(current);
  //   setTimeout(() => {
  //     if (ref.current != null) {
  //       ref.current.scrollTop = ref.current.scrollHeight;
  //     }
  //   }, 100);
  // }

  // useEffect(() => {
  //   async function makeAPIRequest() {
  //     const { data } = await doAPIRequest(`/post/${poster}${time}/comments`, {
  //       method: "GET",
  //     });
  //     setCommentData(data);
  //   }
  //   makeAPIRequest();
  // }, []);

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
              <TextArea
                onChange={(e) => setInput(e.target.value)}
                // onSubmit={() => sendMessageHandler()} TODO: PUT THIS IN WHEN IMPLEMENTED
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
                onClick={async () => {
                  await doAPIRequest("/chat", {
                    method: "POST",
                    // TODO: edit body params - add sender, receiver, body of message
                    body: { time: Date.now() },
                  });
                  fetchNewMessages();
                }}
                type="primary"
              >
                Send
              </Button>
            </Form.Item>
          </Layout>
        </Layout>
      </Layout>
      <MessageModal fetchNewMessages={() => fetchNewMessages()} />
    </div>
  );
}

export default Chat;
