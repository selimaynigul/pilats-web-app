import React, { useState } from "react";
import { Card, Body } from "components";
import styled from "styled-components";
import { Row, Col, Segmented } from "antd";

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
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  border-radius: 20px;
`;
const PersonInfo = styled.div`
  background: white;
  border-radius: 30px;
  padding: 20px;
  height: 100%;
`;
const BodyMeasurements = styled.div`
  display: flex;
  gap: 40px;
  height: 600px;
  padding: 20px;
`;
const TabsContainer = styled.div`
  .ant-segmented {
    background: #e6e3ff;
    color: #4d3abd;
    border-radius: 15px;
    padding: 5px;
    &-item {
      height: 35px;
      display: flex;
      align-items: center;

      &:hover {
        background: transparent !important;
      }
    }

    &-item-selected {
      background: #f6f5ff;
      color: inherit;
      border-radius: 12px;
    }
  }
`;

const UsersPage: React.FC = () => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  return (
    <Card
      toolbar={
        <span>
          <TabsContainer>
            <Segmented<string>
              options={["Dersler", "Paketler", "Ölçümler"]}
              onChange={(value) => {
                console.log(value); // string
              }}
            />
          </TabsContainer>
        </span>
      }
    >
      <Row>
        <Col style={{ padding: "20px 0 0 0" }} xs={24} md={8}>
          <PersonInfo></PersonInfo>
        </Col>
        <Col xs={24} md={16} style={{}}>
          {/* <h3>Vücut Ölçümleri</h3> */}
          <BodyMeasurements>
            <div>
              <div>
                <MeasurementDiv isHovered={hoveredPart === "left-arm"}>
                  <div
                    style={{
                      background: "#e6e3ff",

                      borderRadius: 15,
                      padding: "10px 20px",
                      width: "fit-content",
                    }}
                  >
                    Sol Kol
                  </div>
                  <span>Yağ (kg):</span>
                  <span>Yağ (kg):</span>
                  <span>Yağ (kg):</span>
                </MeasurementDiv>
                <MeasurementDiv isHovered={hoveredPart === "body"}>
                  <div
                    style={{
                      background: "#e6e3ff",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 15,
                      padding: "10px 20px",
                      width: "fit-content",
                    }}
                  >
                    Gövde
                  </div>
                  <span>Yağ (kg):</span>
                  <span>Yağ (kg):</span>
                  <span>Yağ (kg):</span>
                </MeasurementDiv>
                <MeasurementDiv isHovered={hoveredPart === "left-leg"}>
                  <div
                    style={{
                      background: "#e6e3ff",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 15,
                      padding: "10px 20px",
                      width: "fit-content",
                    }}
                  >
                    Sol Bacak
                  </div>
                  <span>Yağ (kg):</span>
                  <span>Yağ (kg):</span>
                  <span>Yağ (kg):</span>
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
                    borderRadius: 15,
                    padding: "10px 20px",
                    width: "fit-content",
                  }}
                >
                  Sağ Kol
                </div>
                <span>Yağ (kg):</span>
                <span>Yağ (kg):</span>
                <span>Yağ (kg):</span>
              </MeasurementDiv>
              <MeasurementDiv isHovered={hoveredPart === "right-leg"}>
                <div
                  style={{
                    background: "#e6e3ff",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 15,
                    padding: "10px 20px",
                    width: "fit-content",
                  }}
                >
                  Sağ Bacak
                </div>
                <span>Yağ (kg):</span>
                <span>Yağ (kg):</span>
                <span>Yağ (kg):</span>
              </MeasurementDiv>
            </div>
          </BodyMeasurements>
        </Col>
      </Row>
      <div style={{ width: 30, height: 2000 }}></div>
    </Card>
  );
};
export default UsersPage;
