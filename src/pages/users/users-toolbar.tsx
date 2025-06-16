import React, { useState } from "react";
import { Form, message } from "antd";
import AddUserModal from "./add-user-form/add-user-form";
import { userService } from "services";
import { handleError } from "utils/apiHelpers";
import { getBranchId, hasRole } from "utils/permissionUtils";
import moment from "moment";
import EntityToolbar from "components/EntityToolbar";
import { useLanguage } from "hooks";

const UsersToolbar: React.FC<{
  userCount: number;
  selectedCompany: any;
  setSelectedCompany: any;
}> = ({ userCount, selectedCompany, setSelectedCompany }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useLanguage();

  const handleAddUser = async (values: any) => {
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
      branchId: hasRole(["BRANCH_ADMIN"])
        ? getBranchId()
        : parseInt(values.branch, 10),
      jobId: values.jobId,
      location: values.location,
    };

    setLoading(true);
    try {
      await userService.register(payload);
      message.success("User is added");
      setIsModalVisible(false);
      form.resetFields();
      window.location.reload();
    } catch (err: any) {
      if (err.response?.data.errorCode === 102) {
        message.error("User with this email already exists");
      } else {
        handleError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <EntityToolbar
        count={userCount}
        entityLabel={t.usersListed}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        onAddClick={() => setIsModalVisible(true)}
        showCompanyDropdown={hasRole(["ADMIN", "COMPANY_ADMIN"])}
      />
      <AddUserModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddUser}
        form={form}
        loading={loading}
      />
    </>
  );
};

export default UsersToolbar;
