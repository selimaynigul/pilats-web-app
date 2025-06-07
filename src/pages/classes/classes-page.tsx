import React from "react";
import Scheduler from "../../components/scheduler/Scheduler";
import { Helmet } from "react-helmet";
import { useLanguage, useFilter } from "hooks";
import { PopoverProvider } from "contexts";

const ClassesPage: React.FC = () => {
  const { t } = useLanguage();
  const { company, setCompany } = useFilter();

  return (
    <>
      <Helmet>
        <title>Pilats - {t.sessions}</title>
      </Helmet>
      <PopoverProvider>
        <Scheduler selectedCompany={company} setSelectedCompany={setCompany} />
      </PopoverProvider>
    </>
  );
};

export default ClassesPage;
