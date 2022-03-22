import React, { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUserContext } from "../../context/Auth";
import { signupRequest } from "../../modules/storage";
import { Row, Col, Form, Input, Button } from "antd";

function Signup() {
  const { setCredentials } = useContext(AuthUserContext);
  const navigate = useNavigate();
  const signupInput = useRef("");
  async function signupHandler() {
    const input = signupInput.current;
    const { success, error } = await signupRequest(input);
    if (success) {
      setCredentials({ user: input });
      navigate("/");
    } else {
      alert(error);
    }
  }
  function onInputHandler(event) {
    signupInput.current = event.target.value;
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
          <h1>Sign up</h1>
        </Row>

        <Row justify="center">
          <Form
            name="basic"
            onFinish={() => signupHandler()}
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
                Sign up
              </Button>
            </Form.Item>
          </Form>
        </Row>
      </Col>
    </Row>
  );
}

export default Signup;
