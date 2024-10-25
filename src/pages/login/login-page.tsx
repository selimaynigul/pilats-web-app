import React, { useState } from "react";
import {
  Input,
  Button,
  Form,
  Typography,
  Switch,
  Select,
  Divider,
  Carousel,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  SunFilled,
  MoonFilled,
} from "@ant-design/icons";
import styled, { keyframes } from "styled-components";
import { useTheme } from "contexts/ThemeProvider";

const { Title, Text, Link } = Typography;
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
    animation: spin_words 20s infinite;

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
const FirstSlide = styled.div`
  /*   background: url("slide2.png");
  background-size: cover; */
  width: 100%;
  height: 100%;
  background: #5d46e5;
  /*  padding: 60px; */
  box-sizing: border-box;

  .ant-typography {
    color: white;
  }
`;
const TestSlide = styled.div`
  width: 100%;
  height: 100%;
  background: #5d46e5;

  box-sizing: border-box;

  .ant-typography {
    color: white;
  }

  position: relative;
`;

const SkeletonWrapper = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? "flex" : "none")};
  width: 80%;
  padding: 22px;
  gap: 10px;
`;

// Skeleton parts
const AvatarSkeleton = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 10px;
  background-color: #a599ff;
  flex-shrink: 0;
`;

const LineSkeleton = styled.div`
  height: 16px;
  border-radius: 5px;
  background-color: #c0b3ff;
  margin: 5px 0;
`;

// Wrapper for skeleton lines
const TextSkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const FirstSlideContent = styled.div``;
const LoginButton = styled(Button)`
  background: ${({ theme }) => theme.primary};
`;

const Box = styled.div`
  width: 242px;
  height: 152px;
  border-radius: 15px;
  background-color: #6a55e6;

  &:hover {
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    scale: 1.04;
    transition: 0.2s;
    background: #a398e3;
  }
`;

const Container = styled.div`
  height: 100%; /* Adjust height based on your need */
  width: 80%;
  margin-left: auto;
  position: absolute;
  right: 16px;
  top: -17px;
`;

const AlignWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Align to bottom */
  align-items: flex-end; /* Align to right */
  gap: 16px;
  height: 100%;
  align-self: end;
`;
const TextContent = styled.div`
  position: absolute;
  top: 40px;
  left: 40px;
`;

const LoginPage: React.FC = () => {
  const handleFinish = (values: any) => {
    console.log("Form Values:", values);
  };

  const { theme, toggleTheme } = useTheme();

  const [hovered, setHovered] = useState(false);

  return (
    <Wrapper>
      <Cover>
        <StyledCarousel autoplay autoplaySpeed={8000}>
          <TestSlide>
            <TextContent>
              <Title level={3} color="white">
                Assign traniers and take attendance
              </Title>
              <Text>
                You can easily view and edit your new classes on your calendar!
              </Text>
            </TextContent>
            <Container>
              <Row
                gutter={[16, 16]}
                justify="end"
                style={{
                  height: "100%",
                }}
              >
                {/* First Column */}
                <Col span={8}>
                  <AlignWrapper>
                    <Box
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                    >
                      <SkeletonWrapper visible={hovered}>
                        <AvatarSkeleton />
                        <TextSkeletonWrapper>
                          <LineSkeleton />
                          <LineSkeleton />
                        </TextSkeletonWrapper>
                      </SkeletonWrapper>
                    </Box>
                  </AlignWrapper>
                </Col>

                {/* Second Column */}
                <Col span={8}>
                  <AlignWrapper>
                    <Box />
                    <Box />
                    <Box />
                  </AlignWrapper>
                </Col>

                {/* Third Column */}
                <Col span={8}>
                  <AlignWrapper>
                    <Box />
                    <Box />
                    <Box />
                    <Box />
                  </AlignWrapper>
                </Col>
              </Row>
            </Container>
          </TestSlide>
          <FirstSlide>
            <FirstSlideContent>
              <Title level={3} color="white">
                Assign traniers and take attendance
              </Title>
              <Text>
                You can easily view and edit your new classes on your calendar!
              </Text>
            </FirstSlideContent>
          </FirstSlide>
          <FirstSlide>
            <FirstSlideContent>
              <Title level={3} color="white">
                View and edit new classes
              </Title>
              <Text>
                You can easily view and edit your new classes on your calendar!
              </Text>
            </FirstSlideContent>
          </FirstSlide>
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
        <StyledForm name="login_form" onFinish={handleFinish} layout="vertical">
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
            name="username"
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

          <ForgotPasswordLink href="#">
            Forgot your password?
          </ForgotPasswordLink>

          <ButtonContainer>
            <LoginButton type="primary" htmlType="submit" size="large" block>
              Login
            </LoginButton>
            <Divider plain>or</Divider>

            <Button size="large" block style={{ color: "#5d46e5" }}>
              Sign Up
            </Button>
          </ButtonContainer>
        </StyledForm>
      </LoginFormContainer>
    </Wrapper>
  );
};

export default LoginPage;
