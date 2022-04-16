import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Row, Avatar, Result, Button, Input, Form } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AuthUserContext } from "../../context/Auth";
import { doAPIRequest } from "../../modules/api";
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
    const { data, error } = await doAPIRequest(`/user/${name}`, {
      method: "GET",
    });
    if (data) {
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
          <Form
            name="editProfile"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 12 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label="First Name"
              name="first"
              rules={[
                {
                  pattern: /^[a-zA-Z]*$/,
                  message: "Can only contain letters",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="last"
              rules={[
                {
                  pattern: /^[a-zA-Z]*$/,
                  message: "Can only contain letters",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  pattern: /^[a-zA-Z0-9]*$/,
                  message: "Must be alphanumeric",
                },
                {
                  pattern: /^.{5,10}$/,
                  message: "Must be between 5 and 10 characters in length",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="password"
              rules={[
                {
                  pattern: /^.{5,10}$/,
                  message: "Must be between 5 and 10 characters in length",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Current Password"
              name="password"
              rules={[{ required: true, message: "Enter your password!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Current Password"
              name="password"
              rules={[{ required: true, message: "Confirm Password" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
}

export default ChangeProfile;
