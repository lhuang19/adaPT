import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Steps, Result } from "antd";
import { AuthUserContext } from "../../context/Auth";

import { signupRequest } from "../../modules/storage";
import FormData from "./FormData";

const { Step } = Steps;

function Signup() {
  const { setCredentials } = useContext(AuthUserContext);
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState({});

  const [form] = Form.useForm();

  const next = () => {
    form
      .validateFields()
      .then(() => {
        setCurrent(current + 1);
      })
      .catch(() => {});
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const navigate = useNavigate();

  async function signupHandler() {
    const formData = form.getFieldsValue(true);
    console.log(formData);

    const { username, password } = formData;
    const { success, error } = await signupRequest(username, password);
    if (success) {
      setData(formData);
      setShowForm(false);
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
      {showForm ? (
        <>
          <div style={{ width: "80%", minWidth: "1000px", height: "80%" }}>
            <Row justify="center">
              <h1>Signup</h1>
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
                <Row justify="start" style={{ width: "75%", margin: "auto" }}>
                  <Steps
                    current={current}
                    size="small"
                    style={{ marginBottom: "25px" }}
                  >
                    {FormData.map((item) => (
                      <Step
                        key={item.title}
                        title={item.title}
                        icon={item.icon}
                      />
                    ))}
                  </Steps>
                  <Form
                    name="basic"
                    form={form}
                    onFinish={() => signupHandler()}
                    autoComplete="off"
                    layout="vertical"
                    validateTrigger="onSubmit"
                    style={{ width: "100%" }}
                    labelAlign="left"
                  >
                    {FormData[current].content}
                    <Form.Item>
                      {current < FormData.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
                          Next
                        </Button>
                      )}
                      {current === FormData.length - 1 && (
                        <Button type="primary" htmlType="submit">
                          Sign up
                        </Button>
                      )}
                      {current > 0 && (
                        <Button
                          style={{ margin: "0 8px" }}
                          onClick={() => prev()}
                        >
                          Previous
                        </Button>
                      )}
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
        </>
      ) : (
        <Result
          status="success"
          title="Successfully Created An Account!"
          subTitle={`Welcome ${data.username}`}
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => {
                setCredentials({ user: data.username });
                navigate("/");
              }}
            >
              Go to Home
            </Button>,
            <Button key="login" onClick={() => navigate("/login")}>
              Login
            </Button>,
          ]}
        />
      )}
    </div>
  );
}

export default Signup;
