import React, { useState } from "react";
import { Form, message } from "antd";
import { companyService } from "services";
import { handleError } from "utils/apiHelpers";
import EntityToolbar from "components/EntityToolbar";
import AddCompanyForm from "./add-company-form/add-company-form";
import { useLanguage } from "hooks";

const CompaniesToolbar: React.FC<{ trainerCount: number }> = ({
  trainerCount,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleAddCompany = async (values: any) => {
    setLoading(true);
    try {
      await companyService.add(values);
      message.success("Company added successfully");
      form.resetFields();
      setIsModalVisible(false);
      window.location.reload();
    } catch (err: any) {
      if (err.response?.data?.message) {
        message.error(err.response.data.message);
      }
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <EntityToolbar
        count={trainerCount}
        entityLabel={t.companiesListed}
        onAddClick={() => setIsModalVisible(true)}
        showCompanyDropdown={false}
      />

      <AddCompanyForm
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddCompany}
        loading={loading}
        form={form}
      />
    </>
  );
};

export default CompaniesToolbar;
