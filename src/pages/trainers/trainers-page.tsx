import React, { useState } from "react";
import TrainerList from "./trainer-list";
import { Card } from "components";
import TrainersToolbar from "./trainers-toolbar";

const TrainersPage: React.FC = () => {
  const [trainerCount, setTrainerCount] = useState(0);
  const [company, setCompany] = useState({
    companyName: "All",
    id: null,
  });

  const updateTrainerCount = (count: number) => {
    setTrainerCount(count);
  };

  return (
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
  );
};

export default TrainersPage;
