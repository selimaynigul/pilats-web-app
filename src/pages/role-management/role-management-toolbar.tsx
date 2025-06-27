import React, { useState } from "react";
import { Form, message, Tooltip } from "antd";
import { AiOutlineSwap } from "react-icons/ai";
import AddButton from "components/AddButton";
import AddAdminModal from "./add-admin-modal";
import { CompanyDropdown } from "components";
import { hasRole } from "utils/permissionUtils";
import { companyAdminService, branchAdminService } from "services";
import { useLanguage } from "hooks";
import EntityToolbar from "components/EntityToolbar";
import { Button } from "antd";
import styled from "styled-components";
import { count } from "console";

const TabButton = styled(Button)`
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

const RoleManagementToolbar: React.FC<{
  adminCount: number;
  selectedCompany: any;
  setSelectedCompany: any;
  isBranchMode: boolean;
  setIsBranchMode: any;
}> = ({
  adminCount,
  selectedCompany,
  setSelectedCompany,
  isBranchMode,
  setIsBranchMode,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    const phoneNumber = `${values.countryCode}${values.phoneNumber}`;
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
        telNo1: phoneNumber,
        countryCode: values.countryCode,
      },
      companyId: values.company,
      ...(isBranchMode && { branchId: values.branch }),
    };

    setLoading(true);
    try {
      if (isBranchMode) {
        await branchAdminService.register(payload);
        message.success(t.msg.branchAdminAddedSuccess);
        window.location.reload();
      } else {
        await companyAdminService.register(payload);
        message.success(t.msg.companyAdminAddedSuccess);
        form.resetFields();
        window.location.reload();
      }
      setIsModalVisible(false);
    } catch (err: any) {
      console.error("Error adding admin:", err);
      if (err.response && err.response.data.errorCode === 102) {
        message.error(t.msg.emailAlreadyExists);
      } else {
        message.error(t.msg.failedToAddAdmin);
      }
    } finally {
      setLoading(false);
    }
  };

  const changeTabs = () => {
    if (hasRole(["ADMIN"])) {
      setIsBranchMode((prev: boolean) => !prev);
    }
  };

  const switchTab = (
    <TabButton disabled={!hasRole(["ADMIN"])} onClick={changeTabs}>
      {isBranchMode ? t.branch : t.company}
      <AiOutlineSwap />
    </TabButton>
  );

  const extraContent = (
    <>
      {hasRole(["ADMIN"]) ? (
        <Tooltip
          title={
            isBranchMode ? "Switch to Company Mode" : "Switch to Branch Mode"
          }
        >
          {switchTab}
        </Tooltip>
      ) : (
        switchTab
      )}
    </>
  );

  return (
    <>
      <EntityToolbar
        count={adminCount}
        entityLabel={t.adminsListed}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        onAddClick={() => setIsModalVisible(true)}
        showCompanyDropdown={true}
        showAddButton={true}
        extra={extraContent}
      />
      <AddAdminModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
        isBranchMode={isBranchMode}
        form={form}
        loading={loading}
      />
    </>
  );
};

export default RoleManagementToolbar;
