import React, { useState } from "react";
import styled from "styled-components";
import AddButton from "components/AddButton";
import AddAdminModal from "./add-admin-modal";
import { message, Switch, Tooltip } from "antd";
import { CompanyDropdown } from "components";
import { hasRole } from "utils/permissionUtils";
import { BsBuilding, BsBuildings } from "react-icons/bs";
import { companyAdminService, branchAdminService } from "services";

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
  background: white;
  height: 50px;
  border-radius: 50px;
  align-items: center;
  padding: 10px;
`;

const CountNumber = styled.span`
  color: ${({ theme }) => theme.primary}; /* Primary color for the number */
`;

const SwitchContainer = styled.div`
  .ant-switch-checked {
    background-color: ${({ theme }) =>
      theme.primary} !important; /* Active state */
  }

  .ant-switch {
    height: 30px;
    min-width: 100px;
  }
`;

const RoleManagementToolbar: React.FC<{
  trainerCount: number;
  selectedCompany: any;
  setSelectedCompany: any;
}> = ({ trainerCount, selectedCompany, setSelectedCompany }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBranchMode, setIsBranchMode] = useState(false); // Switch state

  const handleAddAdmin = async (values: any) => {
    const payload = {
      uaRegisterRequest: {
        email: values.email,
        password: "1234",
      },
      ucRegisterRequest: {
        name: values.name,
        surname: values.surname,
        birthdate: values.birthdate,
        gender: values.gender.toUpperCase(),
        telNo1: values.phoneNumber,
      },
      companyId: values.company,
      ...(isBranchMode && { branchId: values.branch }), // Include branchId if branch mode
    };

    console.log(payload);

    try {
      if (isBranchMode) {
        await branchAdminService.register(payload);
        message.success("Branch Admin added successfully!");
      } else {
        await companyAdminService.register(payload);
        message.success("Company Admin added successfully!");
      }
      setIsModalVisible(false);
    } catch (err) {
      console.error("Error adding admin:", err);
      message.error("Failed to add admin. Please try again.");
    }
  };

  return (
    <ToolbarContainer>
      <CountContainer>
        <CountNumber>{trainerCount}</CountNumber> admins listed
      </CountContainer>
      <ActionContainer>
        {hasRole(["ADMIN", "COMPANY_ADMIN"]) && (
          <CompanyDropdown
            selectedItem={selectedCompany}
            onSelect={(company) => setSelectedCompany(company)}
          />
        )}
        <Tooltip
          title={
            isBranchMode ? "Switch to Company Mode" : "Switch to Branch Mode"
          }
        >
          <SwitchContainer>
            <Switch
              checked={isBranchMode}
              onChange={setIsBranchMode}
              checkedChildren={<BsBuilding />}
              unCheckedChildren={<BsBuildings />}
            />
          </SwitchContainer>
        </Tooltip>
        <AddButton onClick={() => setIsModalVisible(true)} />
      </ActionContainer>
      <AddAdminModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddAdmin}
        isBranchMode={isBranchMode}
      />
    </ToolbarContainer>
  );
};

export default RoleManagementToolbar;
