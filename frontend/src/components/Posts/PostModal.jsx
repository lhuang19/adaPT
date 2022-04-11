import React, { useState, useContext } from "react";
import { Tooltip, Button, Modal, Form, Input } from "antd";
import { FormOutlined } from "@ant-design/icons";
import { postPost } from "../../modules/storage";
import { doAPIRequest } from "../../modules/api";
import { AuthUserContext } from "../../context/Auth";

function PostModal({ fetchNewPosts }) {
  const [show, setShow] = useState(false);
  const [form] = Form.useForm();
  const { credentials } = useContext(AuthUserContext);

  async function onCreate(values) {
    const postData = values;
    postData.time = Date.now();
    postData.poster = credentials.username;
    await doAPIRequest("/post", {
      method: "POST",
      body: postData,
    });
    setShow(false);
    fetchNewPosts();
  }

  return (
    <>
      <Modal
        title="Make a post"
        centered
        visible={show}
        okText="Post"
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
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Please input a title!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Body"
            name="body"
            rules={[
              {
                required: true,
                message: "Please input a body!",
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
        <Tooltip title="Post">
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

export default PostModal;
