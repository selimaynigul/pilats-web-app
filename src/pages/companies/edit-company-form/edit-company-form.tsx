import React, { useEffect, useState } from "react";
import { Form, DatePicker, Checkbox, message } from "antd";
import StepModal, { CustomStep, FormRow } from "components/StepModal";
import dayjs from "dayjs";
import {
  NameInput,
  SurnameInput,
  GenderSelect,
  BirthdatePicker,
  EmailInput,
  PhoneInput,
  LocationInput,
  JobSelect,
} from "components/FormFields";

interface EditCompanyFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
  loading: boolean;
}

const safeFormat = (d?: dayjs.Dayjs | null) =>
  d && dayjs.isDayjs(d) && d.isValid() ? d.format("YYYY-MM-DD") : null;

const EditCompanyForm: React.FC<EditCompanyFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!initialValues) return;

    // Map backend fields to form fields
    const name = initialValues.companyName || "";
    const fullPhone = initialValues.telNo || "";
    const knownCodes = ["+90", "+1", "+44", "+49", "+33"];
    const matchedCode =
      knownCodes.find((code) => fullPhone.startsWith(code)) || "+90";
    const phoneNumber = fullPhone.replace(matchedCode, "");
    const location = initialValues.location || "";
    const mail = initialValues.mail || "";

    form.setFieldsValue({
      name,
      phoneNumber,
      countryCode: matchedCode,
      location,
      email: mail,
    });
  }, [initialValues]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedPhone = `${values.countryCode}${values.phoneNumber}`;

      const payload = {
        id: initialValues.id,
        companyName: values.name,
        location: values.location,
        telNo: formattedPhone,
        countryCode: values.countryCode,
      };

      onSubmit(payload);
    } catch (err) {
      console.error(err);
    }
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
                disabled={true}
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Enter a valid email" },
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
      title="Edit Company"
      steps={formSteps}
      form={form}
      loading={loading}
    />
  );
};

export default EditCompanyForm;
