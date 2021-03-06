import React, { useState, useContext, useEffect } from "react";
import { Tooltip, Button, Modal, Form, Input, Upload } from "antd";
import { FormOutlined, InboxOutlined } from "@ant-design/icons";

import { doAPIRequest, getApiURL } from "../../modules/api";
import { AuthUserContext } from "../../context/Auth";

function PostModal({ fetchNewPosts }) {
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
    const postData = values;
    postData.time = Date.now();
    postData.poster = credentials.username;
    if (postData.media === undefined) {
      delete postData.media;
    } else {
      postData.media = postData.media.file.name;
    }
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
          <Form.Item
            label="Media"
            name="media"
            valuePropName="media"
            getValueFromEvent={(e) => e}
            noStyle
          >
            <Upload.Dragger
              name="file"
              action={getApiURL("/upload")}
              multiple={false}
              maxCount={1}
              onRemove={(e) =>
                doAPIRequest(`/upload/${e.name}`, {
                  method: "DELETE",
                })
              }
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">Share your PT exercises!</p>
            </Upload.Dragger>
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
            data-testid="post-modal-button"
          />
        </Tooltip>
      </div>
    </>
  );
}

export default PostModal;
