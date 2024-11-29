import React from "react";
import { Row, Col } from "antd";
import TrainerInfo from "./trainer-info/trainer-info-card";
import TrainerClassesList from "./trainer-classes/trainer-classes-list";
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
`;

const TrainerDetailPage: React.FC = () => {
  return (
    <Container>
      <Row gutter={[16, 16]} style={{ height: "100%" }}>
        <Col xs={24} sm={24} md={8}>
          <TrainerInfo />
        </Col>

        <Col xs={24} sm={24} md={16}>
          <TrainerClassesList />
        </Col>
      </Row>
    </Container>
  );
};

export default TrainerDetailPage;
