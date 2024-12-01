import React from "react";
import { Row, Col } from "antd";

import styled from "styled-components";

const Container = styled.div`
  height: 100%;
`;

const CompanyDetailsPage: React.FC = () => {
  return (
    <Container>
      <Row gutter={[16, 16]} style={{ height: "100%" }}>
        <Col xs={24} sm={24} md={8}>
          company detail page
        </Col>

        <Col xs={24} sm={24} md={16}></Col>
      </Row>
    </Container>
  );
};

export default CompanyDetailsPage;
