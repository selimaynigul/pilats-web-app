import React from "react";
import { Form } from "antd";
import StepModal, { CustomStep, FormRow } from "components/StepModal";
import {
  NameInput,
  EmailInput,
  PhoneInput,
  LocationInput,
} from "components/FormFields";
import { useLanguage } from "hooks";

interface AddCompanyFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  loading: boolean;
  form: any;
}

const AddCompanyForm: React.FC<AddCompanyFormProps> = ({
  visible,
  onClose,
  onSubmit,
  loading,
  form,
}) => {
  const { t } = useLanguage();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: any) => {
        const payload = {
          companyName: values.name,
          telNo: `${values.countryCode}${values.phoneNumber}`,
          mail: values.email,
          location: values.location,
        };
        onSubmit(payload);
      })
      .catch((err: any) => {
        console.error("Validation failed:", err);
      });
  };

  const formSteps: CustomStep[] = [
    {
      label: t.companyInfo,
      buttonText: t.addCompany,
      blocks: [
        {
          title: t.companyInfo,
          description: t.enterCompanyInfo,
          fields: [
            <NameInput
              placeholder={t.companyNamePlaceholder}
              rules={[{ required: true, message: t.pleaseEnterCompanyName }]}
            />,
            <FormRow>
              <PhoneInput
                rules={[{ required: true, message: t.pleaseEnterPhoneNumber }]}
              />
              <EmailInput
                rules={[
                  { required: true, message: t.pleaseEnterEmail },
                  { type: "email", message: t.invalidEmailFormat },
                ]}
              />
            </FormRow>,
            <LocationInput />,
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
      loading={loading}
      title={t.addCompany}
      steps={formSteps}
      form={form}
    />
  );
};

export default AddCompanyForm;
