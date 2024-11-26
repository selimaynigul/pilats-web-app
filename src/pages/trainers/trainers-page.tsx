import React from "react";
import TrainerList from "./trainer-list";
import { Card } from "components";
import TrainersToolbar from "./trainers-toolbar";

const TrainersPage: React.FC = () => {
  return (
    <Card toolbar={<TrainersToolbar />}>
      <TrainerList />
    </Card>
  );
};
export default TrainersPage;
