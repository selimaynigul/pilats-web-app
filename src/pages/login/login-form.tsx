import React, { useState, useContext } from "react";
import { Form, Input, Button, Divider, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import styled from "styled-components";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
`;

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    return 1;
  };
  return (
    <FormContainer>
      <Form
        name="normal_login"
        style={{ width: "100%" }}
        initialValues={{
          remember: true,
        }}
        onFinish={handleLogin}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="site-form-item-icon" />}
            placeholder="Mail"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 0 }}
          name="password"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password
            style={{ marginBottom: 5 }}
            prefix={<LockOutlined className="site-form-item-icon" />}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item style={{ margin: 0, marginBottom: 10 }}></Form.Item>

        <Form.Item style={{ marginBottom: 10 }}>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
          ></Button>
        </Form.Item>
        <Divider style={{ color: "gray" }} plain></Divider>
        <Form.Item>
          <Button type="default" style={{ width: "100%" }}></Button>
        </Form.Item>
      </Form>
    </FormContainer>
  );
};

export default Login;
