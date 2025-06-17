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

interface EditUserFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialValues: any;
  loading: boolean;
}

const safeFormat = (d?: dayjs.Dayjs | null) =>
  d && dayjs.isDayjs(d) && d.isValid() ? d.format("YYYY-MM-DD") : null;

const EditUserForm: React.FC<EditUserFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!initialValues) return;

    const rawBirthdate = initialValues.ucGetResponse?.birthdate;
    const birthdate = dayjs(rawBirthdate);
    const validBirthdate = birthdate.isValid() ? birthdate : null;

    const fullPhone = initialValues?.ucGetResponse?.telNo1 || "";
    const knownCodes = ["+90", "+1", "+44", "+49", "+33"];
    const matchedCode =
      knownCodes.find((code) => fullPhone.startsWith(code)) || "+90";
    const phoneNumber = fullPhone.replace(matchedCode, "");

    setIsActive(!initialValues.passive);

    form.setFieldsValue({
      name: initialValues.ucGetResponse?.name,
      surname: initialValues.ucGetResponse?.surname,
      email: initialValues.email,
      phoneNumber,
      countryCode: matchedCode,
      birthdate: validBirthdate,
      gender: initialValues.ucGetResponse?.gender,
      location: initialValues.location,
      jobId: initialValues.jobId,
      jobName: initialValues.jobName,
      endDate: initialValues.passive
        ? dayjs(initialValues.passiveEndDate)
        : null,
    });
  }, [initialValues]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedPhone = `${values.countryCode}${values.phoneNumber}`;

      const payload = {
        id: initialValues.id,
        passive: !values.isActive,
        passiveEndDate: values.isActive ? null : safeFormat(values.endDate),
        ucUpdateRequest: {
          name: values.name,
          surname: values.surname,
          birthdate: safeFormat(values.birthdate),
          telNo1: formattedPhone,
          gender: values.gender?.toUpperCase() ?? null,
        },
        jobId: values.jobId,
        jobName: values.jobName,
        location: values.location,
      };

      onSubmit(payload);
    } catch (err) {
      console.error(err);
    }
  };

  const formSteps: CustomStep[] = [
    {
      label: "Personal Information",
      buttonText: "Next",
      blocks: [
        {
          title: "User Info",
          description: "Update user's personal and contact details",
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
      ],
    },
    {
      label: "Contact & Status",
      buttonText: "Update User",
      blocks: [
        {
          title: "Contact & Status",
          description: "Update user's contact information and status",
          fields: [
            <FormRow>
              <EmailInput disabled={true} />
              <PhoneInput />
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
      title="Edit Customer"
      steps={formSteps}
      form={form}
      loading={loading}
    />
  );
};

export default EditUserForm;
