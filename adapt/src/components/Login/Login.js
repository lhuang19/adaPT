import React, { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUserContext } from "../../context/Auth";
import { loginRequest } from "../../modules/storage";
import { Row, Col, Form, Input, Button } from "antd";

function Login() {
  const { setCredentials } = useContext(AuthUserContext);
  const navigate = useNavigate();
  const loginInput = useRef("");

  async function loginHandler() {
    const input = loginInput.current;
    const { success, error } = await loginRequest(input);
    if (success) {
      setCredentials({ user: input });
      navigate("/");
    } else {
      alert(error);
    }
  }
  function onInputHandler(event) {
    loginInput.current = event.target.value;
  }
  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Col
        span={16}
        style={{
          padding: "15px",
          border: "1px solid black",
          borderRadius: "5px",
          paddingTop: "50px",
          paddingBottom: "50px",
        }}
      >
        <Row justify="center">
          <h1>Login</h1>
        </Row>

        <Row justify="center">
          <Form
            name="basic"
            onFinish={() => loginHandler()}
            autoComplete="off"
            style={{ width: " 60% " }}
            layout={"vertical"}
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
              <Input onChange={(input) => onInputHandler(input)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Row>
        <Row justify="center">
          <p>
            Don't have an account?{" "}
            <a onClick={() => navigate("/signup")}>Sign up</a>
          </p>
        </Row>
      </Col>
    </Row>
  );
}

export default Login;
