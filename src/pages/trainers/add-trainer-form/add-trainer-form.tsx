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
import { useLanguage } from "hooks";

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

  const { t } = useLanguage();

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
      label: t.aboutTrainer,
      buttonText: t.saveAndContinue,
      blocks: [
        {
          title: t.personalInfo,
          description: t.trainerPersonalInfoDescription,
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
          description: t.contactInfoDescription,
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
      label: t.companyInfo,
      buttonText: t.addTrainer,
      blocks: [
        {
          title: t.companyInfo,
          description: t.companyInfoDescription,
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
      title={t.addTrainer}
      steps={formSteps}
      loading={loading}
      form={form}
    />
  );
};

export default AddTrainerForm;
