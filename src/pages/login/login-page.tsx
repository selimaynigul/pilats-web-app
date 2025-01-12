import React, { useState } from "react";
import { Typography, Switch, Select, Carousel, message } from "antd";
import { SunFilled, MoonFilled } from "@ant-design/icons";
import styled, { keyframes } from "styled-components";
import { useTheme } from "contexts/ThemeProvider";
import { useAuth } from "contexts/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "services";
import LoginForm from "./login-form";
import RegisterForm from "pages/register/register-form";

const { Title, Text } = Typography;
const { Option } = Select;

const LoginFormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  width: 35%;
  height: 100%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const HeaderContainer = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Wrapper = styled.div`
  background: ${({ theme }) => theme.bodyBg};
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`;

const Cover = styled.div`
  background: #f6f5ff;
  width: 65%;
  height: 100%;
  border-radius: 30px;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }

  // css styles file
  .ant-carousel,
  .slick-slider,
  .slick-list,
  .slick-track {
    height: 100% !important;
  }

  .slick-slide > div:first-child {
    height: 100% !important;
  }
`;

const StyledCarousel = styled(Carousel)`
  height: 100%;
`;
const TestSlide = styled.div`
  width: 100%;
  height: 100%;
  background-color: hsla(248, 75%, 58%, 1);
  background-image: radial-gradient(
      at 40% 20%,
      hsla(248, 75%, 58%, 1) 0px,
      transparent 50%
    ),
    radial-gradient(at 65% 15%, hsla(224, 73%, 56%, 1) 0px, transparent 50%);
  box-sizing: border-box;
  position: relative;

  .ant-typography {
    color: white;
  }
`;

const OverlayImage = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  object-fit: cover;
  z-index: 1;
`;

const TextContent = styled.div`
  position: relative;
  top: 40px;
  left: 40px;
  z-index: 2; /* Ensures the content is above the overlay image */
`;
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 20px;
  margin-bottom: 20px;

  margin-left: 30px;
  margin-top: 30px;
  .logo-icon {
    width: 60px;
    transition: width 0.3s ease;
  }

  .logo-text {
    display: inline;
    margin-left: 10px;
    width: 120px;
    transition: opacity 0.3s ease;
  }
`;

const LoginPage: React.FC = () => {
  const handleFinish = (values: any) => {
    handleLogin(values);
  };

  const { theme, toggleTheme } = useTheme();
  const [hovered, setHovered] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const isLogin = location.pathname === "/login";

  const handleLogin = (values: any) => {
    setLoading(true);
    authService
      .login(values)
      .then((res) => {
        login(res.data);
      })
      .catch(() => {
        message.error("Login failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRegister = async (values: {
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      await authService.adminRegister(values);
      message.success("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Cover>
        <StyledCarousel autoplay autoplaySpeed={8000}>
          <TestSlide>
            <OverlayImage src="/login-cover.png" alt="Login Cover" />

            <LogoContainer>
              <img
                className="logo-icon"
                src="/logo-icon-white.svg"
                alt="Logo Icon"
              />
              <img
                className="logo-text"
                src="/logo-text-white.svg"
                alt="Logo Text"
              />
            </LogoContainer>
            <TextContent style={{ top: 20 }}>
              <Title style={{ marginBottom: 10 }} level={3} color="white">
                Simplify and manage your workflows
              </Title>
              <Text style={{ opacity: 0.8 }}>
                Seamlessly organize with all-in-one management
              </Text>
            </TextContent>
          </TestSlide>
          {/*  <TestSlide>
            <TextContent>
              <Title level={3} color="white">
                Assign traniers and take attendance
              </Title>
              <Text>
                You can easily view and edit your new classes on your calendar!
              </Text>
            </TextContent>
          </TestSlide>
          <TestSlide>
            <TextContent>
              <Title level={3} color="white">
                View and edit new classes
              </Title>
              <Text>
                You can easily view and edit your new classes on your calendar!
              </Text>
            </TextContent>
          </TestSlide> */}
        </StyledCarousel>
      </Cover>
      <LoginFormContainer>
        <HeaderContainer>
          <Switch
            checkedChildren={<MoonFilled />}
            unCheckedChildren={<SunFilled />}
            onChange={toggleTheme}
            style={{ backgroundColor: "#5d46e5" }}
          />
          <Select
            defaultValue="EN"
            bordered={false}
            style={{ color: "#8a2be2" }}
          >
            <Option value="EN">EN</Option>
            {/* Add more language options if needed */}
          </Select>
        </HeaderContainer>
        {isLogin ? (
          <LoginForm loading={loading} onFinish={handleFinish} />
        ) : (
          <RegisterForm loading={loading} onFinish={handleRegister} />
        )}
      </LoginFormContainer>
    </Wrapper>
  );
};

export default LoginPage;
