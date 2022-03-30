import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Row, List, Avatar, Result, Button, Divider } from "antd";
import { HeartOutlined, UserOutlined } from "@ant-design/icons";
import { areFriends, addFriend, getPosts, getUserData, removeFriend, requestedFriend, deleteFriendRequest, sendFriendRequest } from "../../modules/storage";
import { AuthUserContext } from "../../context/Auth";
import Post from "../Post/Post";
import "./Profile.css";

function Profile() {
  let { name } = useParams();
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [userNotFound, setUserNotFound] = useState(false);
  const errorMessage = useRef("");
  const [friends, setFriends] = useState(areFriends(username, name));
  const [request, setRequest] = useState(requestedFriend(username, name));

  useEffect(() => {setInterval(() => {
    setFriends(areFriends(username, name));
    setRequest(requestedFriend(username, name));
  }, 2000)}, []);

  async function fetchNewPosts() {
    const newPosts = await getPosts(name);
    setPosts(newPosts);
  }
  useEffect(async () => {
    const { success, data, error } = await getUserData(name);
    console.log(success, data, error);
    if (success) {
      setUserData(data);
      if (name !== undefined) fetchNewPosts();
    } else {
      errorMessage.current = error;
      setUserNotFound(true);
    }
  }, [name]);

  return userNotFound ? (
    <Result
      status="404"
      title="Hmmmm"
      subTitle={errorMessage.current}
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    />
  ) : (
    <Row style={{ width: "100%", height: "100%" }}>
      <Col
        span={10}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Avatar
            size={128}
            icon={<UserOutlined />}
            alt={name.concat("'s profile picture")}
          />
          <h1 style={{ marginBottom: "0px" }}>
            {userData.firstname} {userData.lastname}
          </h1>
          <p style={{ color: "grey" }}>({userData.username})</p>
          {name === username ? (
            <Button>Edit Profile</Button>
          ) :
          !friends && request === 0 ? (
            <Button
              type="primary"
              onClick={() => {
                setRequest(1);
                sendFriendRequest(username, name);
              }}
            >
            Request Friend
            </Button>
          ) :
          !friends && request === 1 ? (
            <Button
              type="primary"
            >
              Requested Friend
            </Button>
          ) :
          !friends && request === 2 ? (
            <div className="buttons">
              <div className="action_btn">
                <Button
                  type="primary"
                  onClick={() => {
                    setRequest(0);
                    setFriends(true);
                    deleteFriendRequest(name, username);
                    addFriend(username, name);
                  }}
                >
                  Accept
                </Button>

                <Button
                  type="primary"
                  onClick={() => {
                    setRequest(0);
                    deleteFriendRequest(name, username);
                  }}
                  danger
                >
                  Decline
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="primary"
              onClick={() => {
                setFriends(false);
                removeFriend(name, username);
              }}
              danger
            >
              Remove Friend
            </Button>
          )}
        </div>
        <Divider type="vertical" />
      </Col>
      <Col span={14} style={{ height: "100%", overflow: "scroll" }}>
        <List
          style={{
            width: "90%",
          }}
          dataSource={posts}
          renderItem={(post) => (
            <List.Item>
              <Post key={`${post.title}-${post.time}`} data={post} />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
}

export default Profile;
