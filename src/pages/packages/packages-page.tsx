import React, { useState } from "react";
import { Card } from "components";
import PackageList from "./package-list";

const PackagesPage: React.FC = () => {
  const [trainerCount, setTrainerCount] = useState(0);
  const [company, setCompany] = useState({
    companyName: "All",
    id: null,
  });

  const updateTrainerCount = (count: number) => {
    setTrainerCount(count);
  };

  return (
    <Card toolbar={<div></div>}>
      <PackageList
        onTrainerCountChange={updateTrainerCount}
        company={company}
      />
    </Card>
  );
};

export default PackagesPage;
