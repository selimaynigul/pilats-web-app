import React from "react";
import Scheduler from "../../components/scheduler/Scheduler";
import { Helmet } from "react-helmet";
import { useLanguage, useFilter } from "hooks";

const ClassesPage: React.FC = () => {
  const { t } = useLanguage();
  const { company, setCompany } = useFilter();

  return (
    <>
      <Helmet>
        <title>Pilats - {t.sessions}</title>
      </Helmet>
      <Scheduler selectedCompany={company} setSelectedCompany={setCompany} />
    </>
  );
};

export default ClassesPage;
