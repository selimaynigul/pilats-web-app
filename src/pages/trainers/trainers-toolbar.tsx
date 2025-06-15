import React, { useState } from "react";
import styled from "styled-components";
import AddButton from "components/AddButton";
import AddTrainerModal from "./add-trainer-form/add-trainer-form";
import { trainerService } from "services";
import { handleError } from "utils/apiHelpers";
import { Form, message } from "antd";
import { CompanyDropdown } from "components";
import moment from "moment";
import { hasRole } from "utils/permissionUtils";
import { Navigate, useNavigate } from "react-router-dom";
import { useLanguage } from "hooks";

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
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.bodyBg};
  padding: 10px 20px;
  gap: 6px;
  border-radius: 50px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 8px;
  background: ${({ theme }) => theme.bodyBg};
  height: 50px;
  border-radius: 50px;
  align-items: center;
  padding: 10px;

  @media (max-width: 768px) {
    margin-left: auto;
  }
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
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const [form] = Form.useForm();

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
        gender: values.gender ? values.gender.toUpperCase() : null,
        telNo1: values.phoneNumber,
      },
      branchId: parseInt(values.branch, 10),
      jobId: values.jobId,
      location: values.location,
      isModalVisible: true,
    };

    setLoading(true);
    trainerService
      .register(payload)
      .then(() => {
        message.success("Trainer is added");
        setIsModalVisible(false);
        form.resetFields();
        window.location.reload();
      })
      .catch((err) => {
        if (err.response?.data.errorCode === 102) {
          message.error("Trainer with this email already exists");
          console.error("Error adding trainer:", err);
          return;
        }
        handleError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ToolbarContainer>
      <CountContainer>
        <CountNumber>{trainerCount}</CountNumber> {t.trainersListed}
      </CountContainer>
      <ActionContainer>
        {hasRole(["ADMIN", "COMPANY_ADMIN"]) && (
          <CompanyDropdown
            selectedItem={selectedCompany}
            onSelect={(company) => {
              setSelectedCompany(company);
            }}
          />
        )}
        <AddButton onClick={() => setIsModalVisible(true)} />
      </ActionContainer>
      <AddTrainerModal
        loading={loading}
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
        }}
        onSubmit={handleAddTrainer}
        form={form}
      />
    </ToolbarContainer>
  );
};

export default TrainersToolbar;
