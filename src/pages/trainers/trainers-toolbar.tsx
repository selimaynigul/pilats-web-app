import React, { useState } from "react";
import styled from "styled-components";
import AddButton from "components/AddButton";
import AddTrainerModal from "./add-trainer-form/add-trainer-form";
import { trainerService } from "services";
import { handleError } from "utils/apiHelpers";
import { message } from "antd";
import { CompanyDropdown } from "components";

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const CountContainer = styled.div`
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  background: white;
  padding: 10px 20px;
  gap: 6px;
  border-radius: 50px;
  display: flex;
  align-items: center;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 8px;
  background: red;
  background: white;
  height: 50px;
  border-radius: 50px;
  align-items: center;
  padding: 10px;
`;

const CountNumber = styled.span`
  color: ${({ theme }) => theme.primary}; /* Primary color for the number */
`;

const TrainersToolbar: React.FC<{
  trainerCount: number;
  selectedCompany: any;
  setSelectedCompany: any;
}> = ({ trainerCount, selectedCompany, setSelectedCompany }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleAddTrainer = (values: any) => {
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
    <ToolbarContainer>
      <CountContainer>
        <CountNumber>{trainerCount}</CountNumber> trainers listed
      </CountContainer>
      <ActionContainer>
        <CompanyDropdown
          selectedCompany={selectedCompany}
          onCompanySelect={(company) => setSelectedCompany(company)}
        />
        <AddButton onClick={() => setIsModalVisible(true)} />
      </ActionContainer>
      <AddTrainerModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddTrainer}
      />
    </ToolbarContainer>
  );
};

export default TrainersToolbar;
