import React from "react";
import { Form } from "antd";
import StepModal, { CustomStep, FormRow } from "components/StepModal";
import { NameInput, EmailInput, PhoneInput } from "components/FormFields";

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
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: any) => {
        const payload = {
          companyName: values.name,
          telNo: `${values.countryCode}${values.phoneNumber}`,
          mail: values.email,
        };
        onSubmit(payload);
      })
      .catch((err: any) => {
        console.error("Validation failed:", err);
      });
  };

  const formSteps: CustomStep[] = [
    {
      label: "Company Info",
      buttonText: "Add Company",
      blocks: [
        {
          title: "Basic Details",
          description: "Enter company information",
          fields: [
            <NameInput
              placeholder="Company Name *"
              rules={[{ required: true, message: "Please enter company name" }]}
            />,
            <FormRow>
              <PhoneInput
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              />
              <EmailInput
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              />
            </FormRow>,
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
      title="Add Company"
      steps={formSteps}
      form={form}
    />
  );
};

export default AddCompanyForm;
