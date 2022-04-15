import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, Button, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { AuthUserContext } from "../../context/Auth";
import { doAPIRequest } from "../../modules/api";
import { addLoginToken } from "../../modules/storage";

function Login() {
  const { setCredentials } = useContext(AuthUserContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  async function loginHandler(values) {
    const { username, password } = values;
    const { data, error } = await doAPIRequest("/login", {
      method: "POST",
      body: { username, password },
    });
    console.log(data, error);
    if (data) {
      const { token, ...body } = data;
      setCredentials(body);
      addLoginToken(token);
      navigate("/");
    } else {
      setErrorMessage(error);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
        minWidth: "100vw",
      }}
    >
      <div
        style={{
          width: "80%",
          minWidth: "450px",
          height: "80%",
        }}
      >
        <Row justify="center">
          <h1>
            <b>Login</b>
          </h1>
        </Row>
        <Row justify="center" style={{ minHeight: "60px" }}>
          <Alert
            message={errorMessage}
            type="error"
            style={{
              display: errorMessage ? "" : "none",
              height: "40px",
              fontWeight: "bolder",
            }}
            showIcon
          />
        </Row>
        <Row justify="center" align="middle">
          <Col
            span={16}
            style={{
              padding: "5px",
              border: "1px solid black",
              borderRadius: "5px",
              paddingTop: "80px",
              paddingBottom: "100px",
            }}
          >
            <Row justify="center">
              <Form
                name="basic"
                onFinish={(values) => loginHandler(values)}
                autoComplete="off"
                style={{ width: " 60% " }}
                layout="vertical"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>
                <Button
                  type="link"
                  style={{ float: "right" }}
                  className="login-form-forgot"
                  href="/"
                >
                  Forgot password?
                </Button>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginBottom: "10px" }}
                  >
                    Log in
                  </Button>
                </Form.Item>
              </Form>
            </Row>
            <Row justify="center">
              <p>
                Don&apos;t have an account?
                <Button
                  type="link"
                  onClick={() => navigate("/signup")}
                  style={{ paddingLeft: "3px" }}
                >
                  Sign up
                </Button>
              </p>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Login;
