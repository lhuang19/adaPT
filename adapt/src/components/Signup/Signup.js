import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Button, Steps, Result, Alert } from "antd";
import { AuthUserContext } from "../../context/Auth";

import { signupRequest } from "../../modules/storage";
import FormData from "./FormData";
import styles from "./Signup.module.scss";

const { Step } = Steps;

function Signup() {
  const { setCredentials } = useContext(AuthUserContext);
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = useState({});
  const [leave, setLeave] = useState(styles.animateIn);

  const [form] = Form.useForm();
  const next = () => {
    form
      .validateFields()
      .then(() => {
        setLeave(styles.animateOut);
        setTimeout(() => {
          setCurrent(current + 1);
          setLeave(styles.animateIn);
        }, 400);
      })
      .catch(() => {});
  };

  const prev = () => {
    setLeave(styles.animateOutRev);
    setTimeout(() => {
      setCurrent(current - 1);
      setLeave(styles.animateInRev);
    }, 400);
  };
  const navigate = useNavigate();

  async function signupHandler() {
    const formData = form.getFieldsValue(true);

    const { success, data, error } = await signupRequest(formData);
    if (success) {
      setShowForm(true);
      setUserData(data);
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
      {showForm ? (
        <div style={{ width: "80%", minWidth: "1000px", height: "80%" }}>
          <Row justify="center">
            <h1>
              <b>Signup</b>
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
                  <div className={leave}>
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
                  </div>
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
      ) : (
        <Result
          status="success"
          title="Successfully Created An Account!"
          subTitle={`Welcome ${userData.username}`}
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => {
                setCredentials(userData);
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
