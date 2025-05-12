import React, { useState } from "react";
import styled from "styled-components";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { Row, Col } from "antd";
import Body from "components/Body";

const weightData = [
  {
    id: "Kilo",
    data: [
      { x: "Jan", y: 72 },
      { x: "Feb", y: 70 },
      { x: "Mar", y: 69 },
      { x: "Apr", y: 68 },
      { x: "May", y: 67 },
    ],
  },
];

const fatData = [
  { date: "Jan", fat: 20 },
  { date: "Feb", fat: 18 },
  { date: "Mar", fat: 17 },
  { date: "Apr", fat: 16 },
  { date: "May", fat: 15 },
];

const muscleData = [
  { date: "Jan", muscle: 42 },
  { date: "Feb", muscle: 44 },
  { date: "Mar", muscle: 45 },
  { date: "Apr", muscle: 46 },
  { date: "May", muscle: 47 },
];

const MeasurementInfoContainer: React.FC = () => {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  return (
    <Row gutter={[16, 16]} style={{ width: "100%", height: "100%" }}>
      {/* Sağ Kolon: Vücut Şeması */}
      <Col xs={24} md={10}>
        <StyledBox>
          <Title>Vücut Şeması</Title>
          <BodyWrapper>
            <Body setHoveredPart={setHoveredPart} />
          </BodyWrapper>
        </StyledBox>
      </Col>

      {/* Sol Kolon: Grafikler */}
      <Col xs={24} md={14}>
        <InnerColumn>
          <StyledBox>
            <Title>Kilo Değişimi</Title>
            <ChartWrapper>
              <ResponsiveLine
                data={weightData}
                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: false,
                }}
                curve="monotoneX"
                axisBottom={{
                  legend: "",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                axisLeft={{
                  legend: "",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                enablePoints={false}
                enableGridX={false}
                enableGridY={true}
                lineWidth={3}
                colors={["#6a5bff"]}
                useMesh={false}
              />
            </ChartWrapper>
          </StyledBox>

          <StyledBox>
            <Title>Yağ Oranı</Title>
            <ChartWrapper>
              <ResponsiveBar
                data={muscleData}
                keys={["muscle"]}
                indexBy="date"
                margin={{ top: 10, right: 20, bottom: 30, left: 40 }}
                padding={0.3}
                colors={["#4ade80"]} // güzel bir yeşil
                borderRadius={4}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  legend: "",
                }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                enableLabel={false}
              />
            </ChartWrapper>
          </StyledBox>
        </InnerColumn>
      </Col>
    </Row>
  );
};

export default MeasurementInfoContainer;

const StyledBox = styled.div`
  background-color: white;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 200px;
  max-height: 500px;
`;

const BodyWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  max-height: 400px;
`;

const InnerColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 170px; // Sabit tut
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
`;
