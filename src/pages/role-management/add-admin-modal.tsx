import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Modal } from "antd";
import { companyService, branchService } from "services";
import { hasRole, getCompanyId, getUser } from "utils/permissionUtils";
import {
  BirthdatePicker,
  BranchSelect,
  CompanySelect,
  EmailInput,
  GenderSelect,
  LocationInput,
  NameInput,
  PhoneInput,
  SurnameInput,
} from "components/FormFields";
import StepModal, { CustomStep, FormRow } from "components/StepModal";
import { useCompanyBranchSelect } from "hooks/useCompanyBranchSelect";
interface AddAdminModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  isBranchMode: boolean;
  form: any;
  loading: boolean;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isBranchMode,
  form,
  loading,
}) => {
  useEffect(() => {
    if (isBranchMode && hasRole(["COMPANY_ADMIN"])) {
      const companyId = getCompanyId();
      const companyName = getUser().companyName;
      if (companyName) {
        form.setFieldsValue({ company: companyName });
        fetchBranches(companyId);
      }
    }
  }, [isBranchMode, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: any) => {
        onSubmit(values);
      })
      .catch((info: any) => {
        console.error("Validation Failed:", info);
      });
  };

  const {
    companies,
    branches,
    companySearchLoading,
    branchLoading,
    searchCompanies,
    fetchBranches,
  } = useCompanyBranchSelect();

  const formSteps: CustomStep[] = [
    {
      label: "About admin",
      buttonText: "Save & Continue",
      blocks: [
        {
          title: "Personal Info",
          description: "Provide admin's personal info",
          fields: [
            <FormRow>
              <NameInput />
              <SurnameInput />
            </FormRow>,
            <FormRow>
              <GenderSelect />
              <BirthdatePicker />
            </FormRow>,
          ],
        },
        {
          title: "Contact Info",
          description: "Provide admin's contact info",
          fields: [
            <FormRow>
              <EmailInput />
              <PhoneInput />
            </FormRow>,
          ],
        },
      ],
    },
    {
      label: isBranchMode ? "Branch Info" : "Company Info",
      buttonText: isBranchMode ? "Add Branch Admin" : "Add Company Admin",
      blocks: [
        {
          title: isBranchMode ? "Branch Info" : "Company Info",
          description: isBranchMode
            ? "Provide admin's branch info"
            : "Provide admin's company info",
          fields: [
            <Form.Item name="company">
              <CompanySelect
                companies={companies}
                loading={companySearchLoading}
                onSearch={searchCompanies}
                disabled={hasRole(["COMPANY_ADMIN"])}
                onSelect={(value) => {
                  fetchBranches(value);
                  form.setFieldsValue({ branch: undefined });
                }}
              />
              {isBranchMode && (
                <BranchSelect branches={branches} loading={branchLoading} />
              )}
            </Form.Item>,
          ],
        },
      ],
    },
  ];

  return (
    <StepModal
      visible={visible}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={isBranchMode ? "Add Branch Admin" : "Add Company Admin"}
      steps={formSteps}
      loading={loading}
      form={form}
    />
  );
  {
    /* <Modal
      title={isBranchMode ? "Add Branch Admin" : "Add Company Admin"}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        variant="filled"
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item name="name" label="First Name" rules={[{ required: true }]}>
          <Input placeholder="Enter first name" />
        </Form.Item>
        <Form.Item
          name="surname"
          label="Last Name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>
        <Form.Item name="birthdate" label="Birthdate">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="gender" label="Gender">
          <Select placeholder="Select gender">
            <Select.Option value="MALE">Male</Select.Option>
            <Select.Option value="FEMALE">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="phoneNumber" label="Phone Number">
          <Input placeholder="Enter phone number" />
        </Form.Item>
        {!hasRole(["COMPANY_ADMIN"]) && (
          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Search and select company"
              filterOption={false}
              onSearch={handleCompanySearch}
              onSelect={handleCompanySelect}
              loading={companySearchLoading}
              onFocus={() => handleCompanySearch("")}
            >
              {companies.map((company: any) => (
                <Select.Option key={company.id} value={company.id}>
                  {company.companyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {isBranchMode && (
          <Form.Item name="branch" label="Branch" rules={[{ required: true }]}>
            <Select placeholder="Select branch" loading={branchLoading}>
              {branches.map((branch: any) => (
                <Select.Option key={branch.id} value={branch.id}>
                  {branch.branchName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button style={{ marginLeft: "10px" }} onClick={onClose}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal> */
  }
};

export default AddAdminModal;
