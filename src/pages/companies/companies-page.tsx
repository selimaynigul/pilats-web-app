import React, { useState } from "react";
import CompanyList from "./company-list";
import { Card } from "components";
import CompanyToolbar from "./companies-toolbar";

const CompaniesPage: React.FC = () => {
  const [trainerCount, setTrainerCount] = useState(0);
  const [company, setCompany] = useState({
    companyName: "All",
    id: null,
  });

  const updateTrainerCount = (count: number) => {
    setTrainerCount(count);
  };

  return (
    <Card toolbar={<CompanyToolbar trainerCount={trainerCount} />}>
      <CompanyList
        onTrainerCountChange={updateTrainerCount}
        company={company}
      />
    </Card>
  );
};

export default CompaniesPage;
