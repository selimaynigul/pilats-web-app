import React, { useState } from "react";
import TrainerList from "./trainer-list/trainer-list";
import { Card } from "components";
import TrainersToolbar from "./trainers-toolbar";
import { useFilter, useLanguage } from "hooks";
import { Helmet } from "react-helmet";

const TrainersPage: React.FC = () => {
  const [trainerCount, setTrainerCount] = useState(0);
  const { t } = useLanguage();
  const { company, setCompany } = useFilter();

  const updateTrainerCount = (count: number) => {
    setTrainerCount(count);
  };

  return (
    <>
      <Helmet>
        <title>Pilats - {t.trainers}</title>
      </Helmet>
      <Card
        toolbar={
          <TrainersToolbar
            trainerCount={trainerCount}
            selectedCompany={company}
            setSelectedCompany={setCompany}
          />
        }
      >
        <TrainerList
          onTrainerCountChange={updateTrainerCount}
          company={company}
        />
      </Card>
    </>
  );
};

export default TrainersPage;
