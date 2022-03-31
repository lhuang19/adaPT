import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Row, Avatar, Result, Button, Divider, Input, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { AuthUserContext } from "../../context/Auth";
import {
  getUserData,
} from "../../modules/storage";
import "./Profile.css";

function ChangeProfile() {
  let { name } = useParams();
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [userNotFound, setUserNotFound] = useState(false);
  const errorMessage = useRef("");

  const [newUsername, setNewUsername] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  useEffect(async () => {
    const { success, data, error } = await getUserData(name);
    if (success) {
      setUserData(data);
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
        span={24}
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
          <h1 style={{ marginBottom: "10px" }}>
            {userData.firstname} {userData.lastname} ({username})
          </h1>
          <Space direction="vertical" size={"middle"}>
          <Input placeholder="Username" prefix={<UserOutlined />} onChange={(e) => setNewUsername(e.target.value)}/>
            <Space>
              <Input placeholder="First Name" prefix={<UserOutlined />} onChange={(e) => setNewFirstName(e.target.value)}/>
              <Input placeholder="Last Name" prefix={<UserOutlined />} onChange={(e) => setNewLastName(e.target.value)}/>
            </Space>
            <Input.Password
              placeholder="New Password"
              prefix={<LockOutlined />}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input.Password
              placeholder="Enter Password"
              prefix={<LockOutlined />}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input.Password
              placeholder="Re-Enter Password"
              prefix={<LockOutlined />}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <div className="buttons">
              <div className="action_btn">
                <Space size={"large"}>
                <Button type="primary" onClick={() => console.log("Canceled")} danger>
                  Cancel
                </Button>
                <Button type="primary" onClick={() => console.log("Submitted")}>
                  Submit
                </Button>
                </Space>
              </div>
            </div>
          </Space>
        </div>
      </Col>
    </Row>
  );
}

export default ChangeProfile;
