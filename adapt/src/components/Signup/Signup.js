import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { AuthUserContext } from "../../context/Auth";
import { signupRequest } from "../../modules/storage";

function Signup() {
  const { setCredentials } = useContext(AuthUserContext);
  const navigate = useNavigate();
  async function signupHandler(values) {
    const { username, password } = values;
    const { success, error } = await signupRequest(username, password);
    if (success) {
      setCredentials({ user: username });
      navigate("/");
    } else {
      alert(error);
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
          <h1>Signup</h1>
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
                onFinish={(values) => signupHandler(values)}
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
                      message: "Please create a username!",
                    },
                    {
                      pattern: /^[a-zA-Z0-9]*$/,
                      message: "Must be alphanumeric",
                    },
                    {
                      pattern: /.{5,10}/,
                      message: "Must be between 5 and 10 characters in length",
                    },
                  ]}
                  validateTrigger="onSubmit"
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
                      message: "Please create a password!",
                    },
                    {
                      pattern: /.{5,10}/,
                      message: "Must be between 5 and 10 characters in length",
                    },
                  ]}
                  validateTrigger="onSubmit"
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Sign up
                  </Button>
                </Form.Item>
              </Form>
            </Row>
            <Row justify="center">
              <p>
                Already have an account?
                <Button
                  type="link"
                  onClick={() => navigate("/login")}
                  style={{ paddingLeft: "3px" }}
                >
                  Log in
                </Button>
              </p>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Signup;
