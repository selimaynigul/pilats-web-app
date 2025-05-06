import React, { useState } from "react";
import styled from "styled-components";
import { Row, Col } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Body } from "components";
import MeasurementsContainer from "./measurement-info/measurement-info-container";

const Container = styled.div`
  border-radius: 20px;
  padding: 12px;
  height: 100%;

  h2 {
    color: ${({ theme }) => theme.primary};
    margin-bottom: 24px;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
  color: ${({ theme }) => theme.primary};
  font-weight: bold;

  .tab {
    padding: 8px 16px;
    border-radius: 50px;
    transition: 0.2s;
    cursor: pointer;
    font-size: 1.1em;

    &.active {
      background: ${({ theme }) => theme.primary};
      color: #fff;
    }

    &:hover {
    }
  }
`;

const Content = styled.div`
  height: calc(100% - 45px);
`;

const CardContainer = styled.div`
  position: relative;
  background: white;
  border-radius: 20px;
  color: #4f46e5;
  border: 1px solid #e5e5e5;
  &:hover {
    cursor: pointer;
    box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  padding-bottom: 0;
  border-bottom: 1px solid #e5e5e5;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: black;
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: #6a5bff;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #7c7c7c;
  margin: 15px 15px 0;
`;

const FeatureList = styled.div`
  background: #f5f3ff;
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureValue = styled.div`
  background: white;
  border: 1px solid #4f46e5;
  color: #4f46e5;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  margin-right: 10px;
`;

const FeatureLabel = styled.span`
  font-size: 0.9rem;
  color: #4f46e5;
`;

const InfoContainer = styled.div`
  padding: 0 15px 15px;
`;

const Sessions = styled.div`
  max-height: 71vh;
  overflow-x: hidden;

  @media (max-width: 768px) {
    height: 100%;
    overflow: auto;
  }
`;

const SessionCard = styled.div`
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  padding: 16px;
  background-color: #fff;
  transition: 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin-bottom: 12px;
    font-size: 1.1em;
    color: #333;
  }

  p {
    margin: 4px 0 12px;
    font-size: 0.9em;
    color: #666;
  }

  .date-time {
    display: flex;
    gap: 8px;
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.2);
  }
`;

const DateTimeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  background: #f9f9f9;
  font-size: 0.9em;
  color: #555;

  .icon {
    color: #4f46e5;
    font-size: 1.2em;
  }
`;
const MeasurementDiv = styled.div<{ isHovered: boolean }>`
  box-shadow: ${({ isHovered }) =>
    isHovered ? "rgba(149, 157, 165, 0.2) 0px 8px 12px" : "none"};

  scale: ${({ isHovered }) => (isHovered ? "1.1" : "1")};
  background: ${({ isHovered }) =>
    isHovered ? "rgba(255, 255, 255, 0.5)" : "transparent"};
  backdrop-filter: ${({ isHovered }) => (isHovered ? "blur(8px) " : "none")};
  border: ${({ isHovered }) =>
    isHovered ? "1px solid white" : "1px solid transparent"};

  transition: all 0.2s ease;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  border-radius: 20px;
`;

const BodyMeasurements = styled.div`
  display: flex;
  gap: 40px;
  height: 480px;
  margin-left: 40px;
`;
const MeasurementInfoContainer = styled.div`
  margin-left: 10px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

// Mock data for sessions
const mockSessions = [
  {
    id: 1,
    name: "Morning Yoga",
    description: "Start your day with a refreshing yoga session.",
    startDate: "2025-01-12T07:00:00",
    endDate: "2025-01-12T08:30:00",
  },
  {
    id: 2,
    name: "HIIT Workout",
    description: "High-intensity interval training for maximum results.",
    startDate: "2025-01-12T09:00:00",
    endDate: "2025-01-12T10:00:00",
  },
  {
    id: 3,
    name: "Pilates",
    description: "Strengthen your core with this Pilates session.",
    startDate: "2025-01-12T11:00:00",
    endDate: "2025-01-12T12:30:00",
  },
];

// Format the date and time
const formatDateTime = (startDate: string, endDate: string) => {
  const parsedStart = new Date(startDate);
  const parsedEnd = new Date(endDate);

  const date = parsedStart.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const start = parsedStart.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const end = parsedEnd.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, start, end };
};

const UserData: React.FC<{ user: any }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState("classes");
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeTab) {
      case "classes":
        return (
          <Sessions>
            <Row gutter={[16, 16]}>
              {mockSessions.map((session) => {
                const { date, start, end } = formatDateTime(
                  session.startDate,
                  session.endDate
                );

                return (
                  <Col xs={24} sm={12} key={session.id}>
                    <SessionCard>
                      <div>
                        <h3>{session.name}</h3>
                        <p>
                          {session.description || "No description available"}
                        </p>
                        <div className="date-time">
                          <DateTimeBox>
                            <CalendarOutlined className="icon" />
                            {date}
                          </DateTimeBox>
                          <DateTimeBox>
                            <ClockCircleOutlined className="icon" />
                            {start} - {end}
                          </DateTimeBox>
                        </div>
                      </div>
                    </SessionCard>
                  </Col>
                );
              })}
            </Row>
          </Sessions>
        );
      case "packages":
        return (
          <Sessions>
            <Row gutter={[16, 16]}>
              {[
                {
                  id: 1,
                  title: "Gold Membership",
                  price: 199,
                  description:
                    "Enjoy unlimited access to all premium facilities and classes.",
                  features: [
                    { value: "✔", label: "15 participation rights" },
                    { value: "✔", label: "3 cancellation rights" },
                    { value: "✔", label: "2 bonus rights" },
                  ],
                },
              ].map((packageData) => {
                return (
                  <Col xs={24} sm={12} key={packageData.id}>
                    <CardContainer>
                      <CardHeader>
                        <Title>{packageData.title}</Title>
                      </CardHeader>
                      <InfoContainer>
                        <Description>{packageData.description}</Description>
                        <FeatureList>
                          {packageData.features.map((feature, index) => (
                            <FeatureItem key={index}>
                              <FeatureValue>{feature.value}</FeatureValue>
                              <FeatureLabel>{feature.label}</FeatureLabel>
                            </FeatureItem>
                          ))}
                        </FeatureList>
                      </InfoContainer>
                    </CardContainer>
                  </Col>
                );
              })}
            </Row>
          </Sessions>
        );
      case "measurements_1":
        return (
          <BodyMeasurements>
            <div>
              <div>
                <MeasurementDiv isHovered={hoveredPart === "left-arm"}>
                  <div
                    style={{
                      background: "#e6e3ff",

                      borderRadius: 50,
                      padding: "10px 20px",
                      width: "fit-content",
                    }}
                  >
                    Sol Kol
                  </div>
                  <MeasurementInfoContainer>
                    <span>Yağ (%): 17</span>
                    <span>Yağ (kg): 4</span>
                    <span>Kas (kg): 12</span>
                  </MeasurementInfoContainer>
                </MeasurementDiv>
                <MeasurementDiv isHovered={hoveredPart === "body"}>
                  <div
                    style={{
                      background: "#e6e3ff",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 50,
                      padding: "10px 20px",
                      width: "fit-content",
                    }}
                  >
                    Gövde
                  </div>
                  <MeasurementInfoContainer>
                    <span>Yağ (%): 17</span>
                    <span>Yağ (kg): 4</span>
                    <span>Kas (kg): 12</span>
                  </MeasurementInfoContainer>
                </MeasurementDiv>
                <MeasurementDiv isHovered={hoveredPart === "left-leg"}>
                  <div
                    style={{
                      background: "#e6e3ff",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 50,
                      padding: "10px 20px",
                      width: "fit-content",
                    }}
                  >
                    Sol Bacak
                  </div>
                  <MeasurementInfoContainer>
                    <span>Yağ (%): 17</span>
                    <span>Yağ (kg): 4</span>
                    <span>Kas (kg): 12</span>
                  </MeasurementInfoContainer>
                </MeasurementDiv>
              </div>
            </div>
            <Body setHoveredPart={setHoveredPart} />
            <div>
              <MeasurementDiv isHovered={hoveredPart === "right-arm"}>
                <div
                  style={{
                    background: "#e6e3ff",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 50,
                    padding: "10px 20px",
                    width: "fit-content",
                  }}
                >
                  Sağ Kol
                </div>
                <MeasurementInfoContainer>
                  <span>Yağ (%): 15</span>
                  <span>Yağ (kg): 10</span>
                  <span>Kas (kg): 14</span>
                </MeasurementInfoContainer>
              </MeasurementDiv>
              <MeasurementDiv isHovered={hoveredPart === "right-leg"}>
                <div
                  style={{
                    background: "#e6e3ff",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 50,
                    padding: "10px 20px",
                    width: "fit-content",
                  }}
                >
                  Sağ Bacak
                </div>
                <MeasurementInfoContainer>
                  <span>Yağ (%): 15</span>
                  <span>Yağ (kg): 10</span>
                  <span>Kas (kg): 14</span>
                </MeasurementInfoContainer>
              </MeasurementDiv>
            </div>
          </BodyMeasurements>
        );
      case "measurements":
        return <MeasurementsContainer />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <div
          className={`tab ${activeTab === "classes" ? "active" : ""}`}
          onClick={() => setActiveTab("classes")}
        >
          Classes
        </div>
        <div
          className={`tab ${activeTab === "packages" ? "active" : ""}`}
          onClick={() => setActiveTab("packages")}
        >
          Packages
        </div>
        <div
          className={`tab ${activeTab === "measurements" ? "active" : ""}`}
          onClick={() => setActiveTab("measurements")}
        >
          Measurements
        </div>
      </Header>

      <Content>{renderContent()}</Content>
    </Container>
  );
};

export default UserData;
