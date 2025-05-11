import React, { useState } from "react";
import { Card } from "components";
import PackageList from "./package-list/package-list";
import PackagesToolbar from "./packages-toolbar";
import { useLanguage } from "hooks";
import { Helmet } from "react-helmet";

const PackagesPage: React.FC = () => {
  const { t } = useLanguage();
  const [packageCount, setPackageCount] = useState(0);
  const [company, setCompany] = useState({
    companyName: t.all,
    id: null,
  });

  const updateTrainerCount = (count: number) => {
    setPackageCount(count);
  };

  return (
    <>
      <Helmet>
        <title>Pilats - {t.packages}</title>
      </Helmet>
      <Card
        toolbar={
          <PackagesToolbar
            packageCount={packageCount}
            selectedCompany={company}
            setSelectedCompany={setCompany}
          />
        }
      >
        <PackageList
          onTrainerCountChange={updateTrainerCount}
          company={company}
        />
      </Card>
    </>
  );
};

export default PackagesPage;
