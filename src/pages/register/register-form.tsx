import React, { useState } from "react";
import { Form, Input, Button, Divider, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { authService } from "services";

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
  display: flex;
  justify-content: center;
  gap: 6px;
  color: ${({ theme }) => theme.text} !important;
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

const RegisterButton = styled(Button)`
  background: ${({ theme }) => theme.primary};
`;

const BackToLoginButton = styled(Button)`
  color: #5d46e5;
`;

const RegisterForm: React.FC<{ onFinish: any }> = ({ onFinish }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <StyledForm name="register_form" onFinish={onFinish} layout="vertical">
      <StyledTitle level={3}>
        Create an Account on <PurpleText>Pilats</PurpleText>
      </StyledTitle>

      <Catchword>Fill in the details to register as an admin!</Catchword>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Input placeholder="Email" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: "Please input your password!" },
          { min: 4, message: "Password must be at least 4 characters long!" },
        ]}
      >
        <Input.Password placeholder="Password" size="large" />
      </Form.Item>

      <ButtonContainer>
        <RegisterButton
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          Register
        </RegisterButton>
        <Divider plain>or</Divider>
        <BackToLoginButton
          onClick={() => navigate("/login")}
          size="large"
          block
        >
          Back to Login
        </BackToLoginButton>
      </ButtonContainer>
    </StyledForm>
  );
};

export default RegisterForm;
