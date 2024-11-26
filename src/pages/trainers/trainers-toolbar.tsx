import AddButton from "components/AddButton";
import React from "react";

const TrainersToolbar: React.FC = () => {
  return (
    <div>
      <AddButton
        onClick={() => {
          console.log("add button clicked");
        }}
      />
    </div>
  );
};
export default TrainersToolbar;
