import React from "react";
import { Card } from "components";
import CompanyList from "./company-list";

const CompaniesPage: React.FC = () => {
  return (
    <Card toolbar={<div></div>}>
      <CompanyList />
    </Card>
  );
};

export default CompaniesPage;
