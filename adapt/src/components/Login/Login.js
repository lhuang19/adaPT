import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { AuthUserContext } from "../../context/Auth";
import { loginRequest } from "../../modules/storage";

function Login() {
  const { setCredentials } = useContext(AuthUserContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  async function loginHandler(values) {
    const { username, password } = values;
    const { success, error } = await loginRequest(username, password);
    if (success) {
      setCredentials({ user: username });
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
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <div style={{ width: "80%", minWidth: "450px", height: "80%" }}>
        <Row justify="center">
          <h1>Login</h1>
        </Row>
        <Row justify="center" align="middle">
          <Col
            span={16}
            style={{
              padding: "15px",
              border: "1px solid black",
              borderRadius: "5px",
              paddingTop: "120px",
              paddingBottom: "120px",
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
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginBottom: "10px" }}
                  >
                    Log in
                  </Button>
                  <br />
                  <p>
                    <a className="login-form-forgot" href="/">
                      Forgot password?
                    </a>
                    <span style={{ float: "right", color: "red" }}>
                      {errorMessage}
                    </span>
                  </p>
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
