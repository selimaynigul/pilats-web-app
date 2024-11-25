import React from "react";
import TrainerList from "./trainer-list";
import { Card } from "components";

const TrainersPage: React.FC = () => {
  return (
    <Card toolbar={<div></div>}>
      <TrainerList />
    </Card>
  );
};
export default TrainersPage;
