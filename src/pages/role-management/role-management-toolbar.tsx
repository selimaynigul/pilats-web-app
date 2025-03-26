import React, { useState } from "react";
import styled from "styled-components";
import AddButton from "components/AddButton";
import AddAdminModal from "./add-admin-modal";
import { Button, message, Tooltip } from "antd";
import { CompanyDropdown } from "components";
import { hasRole } from "utils/permissionUtils";
import { companyAdminService, branchAdminService } from "services";
import { AiOutlineSwap } from "react-icons/ai";
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
  background: white;
  height: 50px;
  border-radius: 50px;
  align-items: center;
  padding: 10px;

  @media (max-width: 768px) {
    margin-left: auto;
  }
`;

export const TabButton = styled(Button)`
  border: 1px solid transparent;
  background: ${({ theme }) => theme.contentBg};
  color: #4d3abd;
  border-radius: 50px;
  padding: 5px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35px;
  cursor: pointer;
  transition: border 0.2s;
  font-weight: bold;

  &:hover {
    border: 1px solid #4d3abd;
  }
`;

const CountNumber = styled.span`
  color: ${({ theme }) => theme.primary}; /* Primary color for the number */
`;

const RoleManagementToolbar: React.FC<{
  trainerCount: number;
  selectedCompany: any;
  setSelectedCompany: any;
  isBranchMode: boolean;
  setIsBranchMode: any;
}> = ({
  trainerCount,
  selectedCompany,
  setSelectedCompany,
  isBranchMode,
  setIsBranchMode,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t } = useLanguage();

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
        gender: values.gender,
        telNo1: values.phoneNumber,
      },
      companyId: values.company,
      ...(isBranchMode && { branchId: values.branch }),
    };

    try {
      if (isBranchMode) {
        await branchAdminService.register(payload);
        message.success("Branch Admin added successfully!");
        window.location.reload();
      } else {
        await companyAdminService.register(payload);
        message.success("Company Admin added successfully!");
        window.location.reload();
      }
      setIsModalVisible(false);
    } catch (err) {
      console.error("Error adding admin:", err);
      message.error("Failed to add admin. Please try again.");
    }
  };

  const changeTabs = () => {
    if (hasRole(["ADMIN"])) {
      setIsBranchMode((prev: any) => !prev);
    }
  };

  return (
    <ToolbarContainer>
      <CountContainer>
        <CountNumber>{trainerCount}</CountNumber> {t.adminsListed}
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
          <TabButton onClick={changeTabs}>
            {isBranchMode ? t.branch : t.company}
            <AiOutlineSwap />
          </TabButton>
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
