import React from "react";
import { Form } from "antd";
import { addTrainerFormItems } from "./add-trainer-form-items";
import { hasRole, getBranchId } from "utils/permissionUtils";
import StepModal, { CustomStep, FormRow } from "components/StepModal";
import { useCompanyBranchSelect } from "hooks/useCompanyBranchSelect";
import {
  NameInput,
  SurnameInput,
  GenderSelect,
  BirthdatePicker,
  EmailInput,
  PhoneInput,
  LocationInput,
  CompanySelect,
  BranchSelect,
  JobSelect,
} from "components/FormFields";

interface AddTrainerFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  loading: boolean;
  form: any;
}

const AddTrainerForm: React.FC<AddTrainerFormProps> = ({
  visible,
  onClose,
  onSubmit,
  loading,
  form,
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
        let modifiedValues = values;

        const fullPhoneNumber = `${values.countryCode}${values.phoneNumber}`;
        modifiedValues.phoneNumber = fullPhoneNumber;
        delete modifiedValues.countryCode;

        if (hasRole(["BRANCH_ADMIN"])) {
          const branchId = getBranchId();
          modifiedValues = { ...values, branch: branchId, passive: false };
        }

        onSubmit(modifiedValues);
      })
      .catch((info: any) => {
        console.error("Validation Failed:", info);
      });
  };

  const formSteps: CustomStep[] = [
    {
      label: "About trainer",
      buttonText: "Save & Continue",
      blocks: [
        {
          title: "Personal Info",
          description: "Provide trainer's personal info",
          fields: [
            <JobSelect />,
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
          description: "Provide trainer's contact info",
          fields: [
            <FormRow>
              <EmailInput />
              <PhoneInput />
            </FormRow>,
            <LocationInput />,
          ],
        },
      ],
    },
    {
      label: "Company info",
      buttonText: "Add Trainer",
      blocks: [
        {
          title: "Company Info",
          description: "Provide trainer's company/branch info",
          fields: [
            <Form.Item {...addTrainerFormItems.company} name="company">
              <CompanySelect
                companies={companies}
                loading={companySearchLoading}
                onSearch={searchCompanies}
                onSelect={(value) => {
                  fetchBranches(value);
                  form.setFieldsValue({ branch: undefined });
                }}
              />

              <BranchSelect branches={branches} loading={branchLoading} />
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
      title="Add Trainer"
      steps={formSteps}
      loading={loading}
      form={form}
    />
  );
};

export default AddTrainerForm;
