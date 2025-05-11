import React, { useState } from "react";
import Scheduler from "../../components/scheduler/Scheduler";
import { Helmet } from "react-helmet";
import { useLanguage } from "hooks";

const ClassesPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>Pilats - {t.sessions}</title>
      </Helmet>
      <Scheduler />;
    </>
  );
};
export default ClassesPage;
