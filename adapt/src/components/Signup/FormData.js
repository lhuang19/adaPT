import React from "react";
import { Form, Input, Radio } from "antd";

import {
  UserOutlined,
  LockOutlined,
  UserAddOutlined,
  HighlightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const FormData = [
  {
    title: "Account",
    icon: <UserAddOutlined />,
    content: (
      <>
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
              pattern: /^.{5,10}$/,
              message: "Must be between 5 and 10 characters in length",
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} />
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
              pattern: /^.{5,10}$/,
              message: "Must be between 5 and 10 characters in length",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
          />
        </Form.Item>
      </>
    ),
  },
  {
    title: "Personal",
    icon: <InfoCircleOutlined />,
    content: (
      <>
        <Form.Item
          label="First Name"
          name="firstname"
          rules={[
            {
              required: true,
              message: "Please enter a first name!",
            },
            {
              pattern: /^[a-zA-Z]*$/,
              message: "Can only contain letters",
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="lastname"
          rules={[
            {
              required: true,
              message: "Please enter a last name!",
            },
            {
              pattern: /^[a-zA-Z]*$/,
              message: "Can only contain letters",
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} />
        </Form.Item>
      </>
    ),
  },
  {
    title: "Role",
    icon: <HighlightOutlined />,
    content: (
      <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
            message: "Please select a role!",
          },
        ]}
      >
        <Radio.Group name="radiogroup">
          <Radio value="Patient">Patient</Radio>
          <Radio value="PT">PT</Radio>
        </Radio.Group>
      </Form.Item>
    ),
  },
];

export default FormData;
