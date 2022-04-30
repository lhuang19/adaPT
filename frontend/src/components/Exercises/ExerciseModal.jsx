import React, { useState, useContext } from "react";
import { Tooltip, Button, Modal, Form, Input } from "antd";
import { FormOutlined } from "@ant-design/icons";
import { doAPIRequest } from "../../modules/api";
import { AuthUserContext } from "../../context/Auth";

function ExerciseModal() {
  const [show, setShow] = useState(false);
  const [form] = Form.useForm();
  const { credentials } = useContext(AuthUserContext);

  async function onCreate(values) {
    const exerciseData = values;
    exerciseData.pt = credentials.username;
    exerciseData.creationTime = Date.now();
    exerciseData.setsCompleted = 0;
    await doAPIRequest("/exercise", {
      method: "POST",
      body: exerciseData,
    });
    setShow(false);
  }

  return (
    <>
      <Modal
        title="Assign an exercise"
        centered
        visible={show}
        okText="Assign"
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              alert("Validate Failed:", info);
            });
        }}
        onCancel={() => setShow(false)}
        width={1000}
      >
        <Form
          form={form}
          name="basic"
          autoComplete="off"
          style={{ margin: "auto", width: " 60% " }}
          layout="vertical"
        >
          <Form.Item
            label="Patient Username"
            name="patient"
            rules={[
              {
                required: true,
                message:
                  "Please input the username of the patient you would like to assign this exercise to!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Name of Exercise"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input a name for the exercise!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Number of Sets to Perform"
            name="sets"
            rules={[
              {
                required: true,
                message:
                  "Please input the number of reps of this exercise this patient should perform!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Number of Reps to Perform"
            name="reps"
            rules={[
              {
                required: true,
                message:
                  "Please input the number of reps of this exercise this patient should perform!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Instructions for the Exercise"
            name="instructions"
            rules={[
              {
                required: true,
                message:
                  "Please input instructions for how to perform this exercise!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
      <div
        style={{
          position: "fixed",
          bottom: "50px",
          right: "50px",
          transform: "scale(1.5)",
        }}
      >
        <Tooltip title="Assign">
          <Button
            type="primary"
            shape="circle"
            icon={<FormOutlined />}
            size="large"
            onClick={() => setShow(true)}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default ExerciseModal;
