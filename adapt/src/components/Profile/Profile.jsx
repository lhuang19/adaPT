import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Row, List, Avatar, Result, Button, Divider } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { getPosts, getUserData } from "../../modules/storage";
import { AuthUserContext } from "../../context/Auth";
import Post from "../Post/Post";

function Profile() {
  let { name } = useParams();
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [userNotFound, setUserNotFound] = useState(false);
  const errorMessage = useRef("");

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
          ) : (
            <Button>Add Friend</Button>
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
