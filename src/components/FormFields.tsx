import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Divider,
  message,
} from "antd";
import { getUser, hasRole } from "utils/permissionUtils";
import { PlusOutlined } from "@ant-design/icons";
import { jobService } from "services";
import JobForm from "./JobForm";
import { useLanguage } from "hooks";
import { useTheme } from "contexts/ThemeProvider";
import styled from "styled-components";
import dayjs from "dayjs";

interface FormFieldProps {
  rules?: any[];
  placeholder?: string;
  disabled?: boolean | undefined;
}

const countryCodes = [
  { code: "+90", country: "TR" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
];

export const NameInput: React.FC<FormFieldProps> = ({ rules, placeholder }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <Form.Item
      name="name"
      rules={rules || [{ required: true, message: t.pleaseEnterName }]}
    >
      <Input
        style={{ background: theme.inputBg }}
        placeholder={placeholder || t.firstname}
      />
    </Form.Item>
  );
};

export const SurnameInput: React.FC<FormFieldProps> = ({
  rules,
  placeholder,
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <Form.Item
      name="surname"
      rules={
        rules || [
          {
            required: true,
            message: t.pleaseEnterSurname,
          },
        ]
      }
    >
      <Input
        style={{ background: theme.inputBg }}
        placeholder={placeholder || t.lastname}
      />
    </Form.Item>
  );
};

export const GenderSelect: React.FC<FormFieldProps> = ({ rules }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <Form.Item name="gender" rules={rules}>
      <Select
        style={{ background: theme.transparentInputBg }}
        placeholder={
          <span style={{ color: theme.formPlaceholder }}>{t.selectGender}</span>
        }
      >
        <Select.Option value="male">{t.male || "Male"}</Select.Option>
        <Select.Option value="female">{t.female || "Female"}</Select.Option>
      </Select>
    </Form.Item>
  );
};

const StyledDatePicker = styled(DatePicker)`
  input::placeholder {
    color: ${({ theme }) => theme.formPlaceholder} !important;
  }
`;
export const BirthdatePicker: React.FC<FormFieldProps> = ({ rules }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <Form.Item name="birthdate" rules={rules}>
      <StyledDatePicker
        style={{ background: theme.inputBg, width: "100%" }}
        placeholder={t.birthdate}
        disabledDate={(current) => current && current > dayjs().endOf("day")}
      />
    </Form.Item>
  );
};
export const EmailInput: React.FC<FormFieldProps> = ({
  rules,
  disabled = false,
  placeholder,
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <Form.Item
      name="email"
      rules={
        rules || [
          {
            required: true,
            message: t.pleaseEnterEmail,
          },
          {
            type: "email",
            message: t.invalidEmailFormat,
          },
        ]
      }
    >
      <Input
        style={{ background: theme.inputBg }}
        disabled={disabled}
        placeholder={placeholder || t.email}
      />
    </Form.Item>
  );
};

export const PhoneInput: React.FC<FormFieldProps> = ({ rules }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <Form.Item>
      <Input.Group compact style={{ display: "flex" }}>
        <Form.Item name="countryCode" initialValue="+90" noStyle>
          <Select
            style={{ width: "30%", background: theme.transparentInputBg }}
          >
            {countryCodes.map(({ code }) => (
              <Select.Option key={code} value={code}>
                {code}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          rules={[
            ...(rules || [
              { required: true, message: t.pleaseEnterPhoneNumber },
            ]),
            {
              validator: (_, value) => {
                if (!value || value.length === 10) {
                  return Promise.resolve();
                }
                return Promise.reject(t.invalidPhoneNumber);
              },
              validateTrigger: "onSubmit",
            },
          ]}
          noStyle
        >
          <Input
            style={{ width: "70%", background: theme.inputBg }}
            placeholder={t.phoneNumber}
            maxLength={10}
            type="tel"
          />
        </Form.Item>
      </Input.Group>
    </Form.Item>
  );
};

export const LocationInput: React.FC<FormFieldProps> = ({ rules }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <Form.Item name="location" rules={rules || []}>
      <Input style={{ background: theme.inputBg }} placeholder={t.location} />
    </Form.Item>
  );
};

export const CompanySelect = ({
  companies,
  loading,
  onSearch,
  onSelect,
  disabled,
}: {
  companies: any[];
  loading: boolean;
  onSearch: (text: string) => void;
  onSelect: (id: string) => void;
  disabled?: boolean;
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const isDisabled = !hasRole(["ADMIN"]);
  const defaultCompany = hasRole(["COMPANY_ADMIN", "BRANCH_ADMIN"])
    ? getUser().companyName
    : undefined;

  // Eğer defaultCompany varsa, Form.Item'ın initialValue'su olarak ver
  return (
    <Form.Item
      name="company"
      initialValue={defaultCompany}
      rules={[
        {
          required: true,
          message: t.pleaseSelectCompany,
          // Eğer defaultCompany varsa valid say
          validator: (_, value) => {
            if (value !== undefined && value !== null && value !== "") {
              return Promise.resolve();
            }
            if (defaultCompany) {
              return Promise.resolve();
            }
            return Promise.reject(t.pleaseSelectCompany);
          },
        },
      ]}
      style={{ marginBottom: 8 }}
    >
      <Select
        style={{ background: theme.transparentInputBg }}
        disabled={disabled ? disabled : isDisabled}
        showSearch
        filterOption={false}
        onSearch={onSearch}
        onSelect={onSelect}
        loading={loading}
        placeholder={
          <span style={{ color: theme.formPlaceholder }}>
            {t.selectCompany}
          </span>
        }
      >
        {companies.map((company: any) => (
          <Select.Option key={company.id} value={company.id}>
            {company.companyName}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export const BranchSelect = ({
  branches,
  loading,
}: {
  branches: any[];
  loading: boolean;
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const isDisabled = hasRole(["BRANCH_ADMIN"]);
  const defaultBranch = hasRole(["BRANCH_ADMIN"])
    ? getUser().branchName
    : undefined;

  // Eğer defaultBranch varsa, Form.Item'ın initialValue'su olarak ver
  return (
    <Form.Item
      name="branch"
      initialValue={defaultBranch}
      rules={[
        {
          required: true,
          message: t.pleaseSelectBranch,
          validator: (_, value) => {
            if (value !== undefined && value !== null && value !== "") {
              return Promise.resolve();
            }
            if (defaultBranch) {
              return Promise.resolve();
            }
            return Promise.reject(t.pleaseSelectBranch);
          },
        },
      ]}
    >
      <Select
        style={{ background: theme.transparentInputBg }}
        disabled={isDisabled}
        loading={loading}
        placeholder={
          <span style={{ color: theme.formPlaceholder }}>{t.selectBranch}</span>
        }
      >
        {branches.map((branch: any) => (
          <Select.Option key={branch.id} value={branch.id}>
            {branch.branchName}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};
interface JobSelectWithAddProps {
  name?: string;
  rules?: any[];
}

export const JobSelect: React.FC<JobSelectWithAddProps> = ({
  name = "jobId",
  rules,
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobService.getAll();
      setJobs(res.data);
    } catch (err) {
      message.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <Form.Item name={name} rules={rules}>
      <Select
        style={{ background: theme.transparentInputBg }}
        loading={loading}
        placeholder={
          <span style={{ color: theme.formPlaceholder }}>{t.selectJob}</span>
        }
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: "8px 0" }} />
            {isAdding ? (
              <JobForm
                loading={loading}
                onCancel={() => setIsAdding(false)}
                onAdded={() => {
                  setIsAdding(false);
                  fetchJobs();
                }}
              />
            ) : (
              <div style={{ padding: "0 8px", paddingBottom: "4px" }}>
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  block
                  onClick={() => setIsAdding(true)}
                >
                  {t.addJob}
                </Button>
              </div>
            )}
          </>
        )}
      >
        {jobs.map((job) => (
          <Select.Option key={job.id} value={job.id}>
            {job.jobName}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};
