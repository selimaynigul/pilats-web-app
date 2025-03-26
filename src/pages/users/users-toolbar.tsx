import React, { useState } from "react";
import styled from "styled-components";
import AddButton from "components/AddButton";
import AddUserModal from "./add-user-form/add-user-form";
import { trainerService, userService } from "services";
import { handleError } from "utils/apiHelpers";
import { message } from "antd";
import { CompanyDropdown } from "components";
import moment from "moment";
import { hasRole } from "utils/permissionUtils";
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
  background: white;
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
  background: red;
  background: white;
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

const UsersToolbar: React.FC<{
  userCount: number;
  selectedCompany: any;
  setSelectedCompany: any;
}> = ({ userCount, selectedCompany, setSelectedCompany }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const { t } = useLanguage();

  const handleAddUser = (values: any) => {
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
      branchId: parseInt(values.branch, 10),
      jobId: values.jobId,
      location: values.location,
    };

    userService
      .register(payload)
      .then(() => {
        message.success("User is added");
        setIsModalVisible(false);
        window.location.reload();
      })
      .catch((err) => {
        if (err.response?.data.errorCode === 102) {
          message.error("User with this email already exists");
          console.error("Error adding user:", err);
          return;
        }
        handleError(err);
      });
  };

  return (
    <ToolbarContainer>
      <CountContainer>
        <CountNumber>{userCount}</CountNumber> {t.usersListed}
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
      <AddUserModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddUser}
      />
    </ToolbarContainer>
  );
};

export default UsersToolbar;
