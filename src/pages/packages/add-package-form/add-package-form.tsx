import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Modal,
  Switch,
  message,
} from "antd";
import { companyService, branchService } from "services";
import { getCompanyId, getUser, hasRole } from "utils/permissionUtils";
import StepModal, { CustomStep, FormRow } from "components/StepModal";
import { useCompanyBranchSelect } from "hooks/useCompanyBranchSelect";

interface AddPackageFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  form: any;
  loading: boolean;
}

const AddPackageForm: React.FC<AddPackageFormProps> = ({
  visible,
  onClose,
  onSubmit,
  form,
  loading,
}) => {
  const {
    companies,
    branches,
    companySearchLoading,
    branchLoading,
    searchCompanies,
    fetchBranches,
  } = useCompanyBranchSelect();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: any) => {
        onSubmit(values);
      })
      .catch((info: any) => {
        message.error("Formu eksiksiz doldurun");
        console.error("Validation Failed:", info);
      });
  };

  const steps: CustomStep[] = [
    {
      label: "Package details",
      buttonText: "Save & Continue",
      blocks: [
        {
          title: "Package info",
          description: "Provide package info",
          fields: [
            <FormRow>
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: "Please enter the package name" },
                ]}
              >
                <Input placeholder="Name *" />
              </Form.Item>
              <Form.Item
                name="price"
                rules={[{ required: true, message: "Please enter the price" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Price (₺) *"
                />
              </Form.Item>
            </FormRow>,
            <Form.Item name="description">
              <Input.TextArea placeholder="Description" />
            </Form.Item>,
          ],
        },
        {
          title: "Package details *",
          description: "Provide package details info",
          fields: [
            <FormRow>
              <Form.Item
                name="creditCount"
                rules={[
                  { required: true, message: "Please enter the credit count" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Credit count *"
                />
              </Form.Item>

              <Form.Item
                name="discount"
                rules={[
                  { required: true, message: "Please enter the discount" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  max={1}
                  step={0.01}
                  placeholder="Discount (e.g., 0.2 for 20%) *"
                />
              </Form.Item>
            </FormRow>,
            <FormRow>
              <Form.Item
                name="bonusCount"
                rules={[
                  { required: true, message: "Please enter the bonus count" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Bonus count *"
                />
              </Form.Item>

              <Form.Item
                name="changeCount"
                rules={[
                  { required: true, message: "Please enter the change count" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Change count *"
                />
              </Form.Item>
            </FormRow>,
          ],
        },
      ],
    },
    {
      label: "Company info",
      buttonText: "Add package",
      blocks: [
        {
          title: "Company info",
          description: "Provide trainer's company/branch info",
          fields: [
            <Form.Item
              name="companyId"
              rules={[
                {
                  required: hasRole(["ADMIN"]),
                  message: "Please select a company",
                },
              ]}
            >
              <Select
                disabled={!hasRole(["ADMIN"])}
                showSearch
                placeholder="Company *"
                filterOption={false}
                onSearch={searchCompanies}
                onSelect={(value) => {
                  fetchBranches(value);
                  form.setFieldsValue({ branchId: undefined });
                }}
                loading={companySearchLoading}
                defaultValue={
                  hasRole(["COMPANY_ADMIN", "BRANCH_ADMIN"])
                    ? getUser().companyName
                    : undefined
                }
              >
                {companies.map((company: any) => (
                  <Select.Option key={company.id} value={company.id}>
                    {company.companyName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>,
            <Form.Item name="branchId">
              <Select
                disabled={hasRole(["BRANCH_ADMIN"])}
                placeholder="Branch"
                loading={branchLoading}
                defaultValue={
                  hasRole(["BRANCH_ADMIN"]) ? getUser().branchName : undefined
                }
              >
                {branches.map((branch: any) => (
                  <Select.Option key={branch.id} value={branch.id}>
                    {branch.branchName}
                  </Select.Option>
                ))}
              </Select>
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
      title="Add Package"
      steps={steps}
      loading={loading}
      form={form}
    />
  );
};

export default AddPackageForm;
