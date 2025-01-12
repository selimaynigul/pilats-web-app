import React, { useState, useContext } from "react";
import { Form, Input, Button, Divider, message, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import styled from "styled-components";
const { Title, Text } = Typography;

const StyledForm = styled(Form)`
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background-color: transparent;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const StyledTitle = styled(Title)`
  margin-bottom: 20px !important;
  box-sizing: content-box;

  display: flex;
  justify-content: center;
  gap: 6px;
  height: 30px;
  color: ${({ theme }) => theme.text} !important;

  .words {
    overflow: hidden;
  }

  span {
    display: block;
    height: 100%;
    animation: spin_words 16s infinite;

    text-align: end;
  }

  @keyframes spin_words {
    44% {
      transform: translateY(0%);
    }

    50% {
      transform: translateY(-100%);
    }
    94% {
      transform: translateY(-100%);
    }

    100% {
      transform: translateY(-200%);
    }
  }
`;

const PurpleText = styled.div`
  color: #5d46e5;
`;

const Catchword = styled(Text)`
  display: block;
  text-align: center;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.text};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 16px;
`;

const ForgotPasswordLink = styled(Link)`
  display: block;
  text-align: right;
  margin-top: 8px;
`;

const LoginButton = styled(Button)`
  background: ${({ theme }) => theme.primary};
  background-color: hsla(248, 75%, 58%, 1);
  background-image: radial-gradient(
      at 40% 20%,
      hsla(248, 75%, 58%, 1) 0px,
      transparent 50%
    ),
    radial-gradient(at 65% 15%, hsla(224, 73%, 56%, 1) 0px, transparent 50%);

  &:hover {
    background-color: hsla(248, 75%, 58%, 1);
    background-image: radial-gradient(
        at 40% 20%,
        hsla(248, 75%, 58%, 1) 0px,
        transparent 50%
      ),
      radial-gradient(at 65% 15%, hsla(224, 73%, 56%, 1) 0px, transparent 50%);
  }
`;

const LoginForm: React.FC<{ onFinish: any; loading: any }> = ({
  onFinish,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <StyledForm
      variant="filled"
      name="login_form"
      onFinish={onFinish}
      layout="vertical"
    >
      <StyledTitle level={3}>
        <div className="words">
          <span>Welcome</span>
          <span>Sign in</span>
          <span>Welcome</span>
        </div>
        to <PurpleText>Pilats</PurpleText>
      </StyledTitle>

      <Catchword>Please log in to your account or sign up!</Catchword>

      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input placeholder="Username" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password placeholder="Password" size="large" />
      </Form.Item>

      <ForgotPasswordLink to="#">Forgot your password?</ForgotPasswordLink>

      <ButtonContainer>
        <LoginButton
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          Login
        </LoginButton>
        <Divider plain>or</Divider>

        <Button
          onClick={() => navigate("/register")}
          size="large"
          block
          style={{ color: "#5d46e5" }}
        >
          Sign Up
        </Button>
      </ButtonContainer>
    </StyledForm>
  );
};

export default LoginForm;
