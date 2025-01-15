import React, { useState } from "react";
import { Row, Col } from "antd";
import CompanyInfo from "./company-info/company-info-card";
import CompanyBranchList from "./company-branches/company-branches-list";
import styled from "styled-components";
import { branchService } from "services";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  height: 100%;
`;

const CompanyDetailsPage: React.FC = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const navigate = useNavigate();

  const refreshBranches = () => {
    navigate("/companies");
  };

  return (
    <Container>
      <Row gutter={[16, 16]} style={{ height: "100%" }}>
        <Col xs={24} sm={24} md={8}>
          <CompanyInfo setBranches={setBranches} />
        </Col>

        <Col xs={24} sm={24} md={16}>
          <CompanyBranchList
            branches={branches}
            onBranchUpdate={refreshBranches}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CompanyDetailsPage;
