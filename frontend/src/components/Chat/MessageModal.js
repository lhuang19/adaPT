import React, { useState, useContext } from "react";
import { Tooltip, Button, Modal, Form, Input } from "antd";
import { FormOutlined } from "@ant-design/icons";
import { postMessage } from "../../modules/storage";
import { doAPIRequest } from "../../modules/api";
import { AuthUserContext } from "../../context/Auth";

function MessageModal({ fetchNewMessages }) {
  const [show, setShow] = useState(false);
  const [form] = Form.useForm();
  const { credentials } = useContext(AuthUserContext);

  useEffect(
    () => () => {
      const mediaValue = form.getFieldValue("media");
      if (mediaValue !== undefined) {
        doAPIRequest(`/upload/${mediaValue.file.name}`, {
          method: "DELETE",
        });
      }
    },
    []
  );
  async function onCreate(values) {
    const messageData = values;
    messageData.time = Date.now();
    messageData.poster = credentials.username;
    if (messageData.media === undefined) {
      delete messageData.media;
    } else {
      messageData.media = messageData.media.file.name;
    }
    await doAPIRequest("/post", {
      method: "POST",
      body: messageData,
    });
    setShow(false);
    fetchNewMessages();
  }


  return (
    <>
      <Modal
        title="Make a Message"
        centered
        visible={show}
        okText="Send"
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
            label="To:"
            name="recipient"
            rules={[
              {
                required: true,
                message: "Please input a recipient!",
              },
            ]}
          >
            <Input />
          </Form.Item>
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
      <div style={{ position: "fixed", bottom: "40px", right: "40px" }}>
        <Tooltip title="Message">
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

export default MessageModal;
