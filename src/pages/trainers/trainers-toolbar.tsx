import React, { useState } from "react";
import { Form, message } from "antd";
import { trainerService } from "services";
import { handleError } from "utils/apiHelpers";
import moment from "moment";
import { getBranchId, hasRole } from "utils/permissionUtils";
import AddTrainerModal from "./add-trainer-form/add-trainer-form";
import EntityToolbar from "components/EntityToolbar";
import { useLanguage } from "hooks";

const TrainersToolbar: React.FC<{
  trainerCount: number;
  selectedCompany: any;
  setSelectedCompany: any;
}> = ({ trainerCount, selectedCompany, setSelectedCompany }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useLanguage();

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
      branchId: hasRole(["BRANCH_ADMIN"])
        ? getBranchId()
        : parseInt(values.branch, 10),
      jobId: values.jobId,
      location: values.location,
    };

    setLoading(true);
    trainerService
      .register(payload)
      .then(() => {
        message.success(t.msg.trainerAddedSuccess);
        setIsModalVisible(false);
        form.resetFields();
        window.location.reload();
      })
      .catch((err) => {
        if (err.response?.data.errorCode === 102) {
          message.error(t.msg.trainerEmailExists);
          return;
        }
        handleError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <EntityToolbar
        count={trainerCount}
        entityLabel={t.trainersListed}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        onAddClick={() => setIsModalVisible(true)}
        showCompanyDropdown={hasRole(["ADMIN", "COMPANY_ADMIN"])}
        showAddButton={hasRole(["ADMIN", "COMPANY_ADMIN", "BRANCH_ADMIN"])}
      />
      <AddTrainerModal
        loading={loading}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddTrainer}
        form={form}
      />
    </>
  );
};

export default TrainersToolbar;
