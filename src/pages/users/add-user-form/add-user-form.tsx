import React from "react";
import { Form } from "antd";
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
import { hasRole, getBranchId } from "utils/permissionUtils";
import { useLanguage } from "hooks";

interface AddUserFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  loading: boolean;
  form: any;
}

const AddUserForm: React.FC<AddUserFormProps> = ({
  visible,
  onClose,
  onSubmit,
  loading,
  form,
}) => {
  const { t } = useLanguage();

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
          modifiedValues = { ...modifiedValues, branch: branchId };
        }

        onSubmit(modifiedValues);
      })
      .catch((info: any) => {
        console.error("Validation Failed:", info);
      });
  };

  const formSteps: CustomStep[] = [
    {
      label: t.aboutUser,
      buttonText: t.saveAndContinue,
      blocks: [
        {
          title: t.personalInfo,
          description: t.userPersonalInfoDescription,
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
          title: t.contactInfo,
          description: t.userContactInfoDescription,
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
      label: t.companyInfo || "Company info",
      buttonText: t.addUser || "Add User",
      blocks: [
        {
          title: t.companyInfo || "Company Info",
          description:
            t.companyInfoDescription || "Provide user's company/branch info",
          fields: [
            <Form.Item name="company">
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
      title={t.addUser}
      steps={formSteps}
      loading={loading}
      form={form}
    />
  );
};

export default AddUserForm;
