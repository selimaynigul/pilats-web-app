import React, { useState } from "react";
import styled from "styled-components";
import AddButton from "components/AddButton";
import AddTrainerModal from "./add-trainer-form/add-trainer-form";
import { trainerService } from "services";
import { handleError } from "utils/apiHelpers";
import { message } from "antd";
import { CompanyDropdown } from "components";
import moment from "moment";
import { hasRole } from "utils/permissionUtils";

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
    const payload = {
      uaRegisterRequest: {
        email: values.email,
        password: "1234",
      },
      ucRegisterRequest: {
        name: values.name,
        surname: values.surname,
        birthdate: values.birthdate
          ? moment(values.birthdate).format("YYYY-MM-DD")
          : null,
        gender: values.gender.toUpperCase(),
        telNo1: values.phoneNumber,
      },
      branchId: parseInt(values.branch, 10), // Ensure this is a valid integer
      /*       jobId: values.jobId || null, // If jobId is optional, send null when not provided
       */
    };

    trainerService
      .register(payload)
      .then(() => {
        message.success("Trainer is added");
        setIsModalVisible(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error adding trainer:", err);
        handleError(err);
      });
  };

  return (
    <ToolbarContainer>
      <CountContainer>
        <CountNumber>{trainerCount}</CountNumber> trainers listed
      </CountContainer>
      <ActionContainer>
        {hasRole(["ADMIN", "COMPANY_ADMIN"]) && (
          <CompanyDropdown
            selectedItem={selectedCompany}
            onSelect={(company) => setSelectedCompany(company)}
          />
        )}
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
