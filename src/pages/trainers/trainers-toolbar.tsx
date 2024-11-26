import React, { useState } from "react";
import AddButton from "components/AddButton";
import AddTrainerModal from "./add-trainer-form/add-trainer-form";
import { trainerService } from "services";
import { handleError } from "utils/apiHelpers";
import { message } from "antd";

const TrainersToolbar: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleAddTrainer = (values: any) => {
    console.log(values);
    trainerService
      .register({
        uaRegisterRequest: {
          email: "aynigulselim@gmail.com",
          password: "1234",
        },
        ucRegisterRequest: {
          name: values.name,
          surname: values.surname,
          birthdate: values.birthdate,
          gender: values.gender,
          telNo1: values.phoneNumber,
        },
        branchId: 1,
      })
      .then(() => {
        message.success("Trainer is added");
        setIsModalVisible(false);
      })
      .catch((err) => handleError(err));
  };

  return (
    <div>
      <AddButton onClick={() => setIsModalVisible(true)} />
      <AddTrainerModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddTrainer}
      />
    </div>
  );
};

export default TrainersToolbar;
