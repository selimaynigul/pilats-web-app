import React, { useState } from "react";
import { Row, Col } from "antd";
import CompanyInfo from "./company-info/company-info-card";
import CompanyBranchList from "./company-branches/company-branches-list";
import styled from "styled-components";
import { branchService } from "services";

const Container = styled.div`
  height: 100%;
`;
const CompanyDetailsPage: React.FC = () => {
  const [branches, setBranches] = useState<any[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const fetchBranches = async (id: string) => {
    try {
      const branchResponse = await branchService.search({ companyId: id });
      setBranches(branchResponse.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const refreshBranches = () => {
    if (companyId) fetchBranches(companyId);
  };

  return (
    <Container>
      <Row gutter={[16, 16]} style={{ height: "100%" }}>
        <Col xs={24} sm={24} md={8}>
          <CompanyInfo
            setCompanyId={setCompanyId}
            fetchBranches={fetchBranches}
          />
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
