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

interface FormFieldProps {
  rules?: any[];
  placeholder?: string;
}

const countryCodes = [
  { code: "+90", country: "TR" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
];

export const NameInput: React.FC<FormFieldProps> = ({ rules, placeholder }) => (
  <Form.Item
    name="name"
    rules={rules || [{ required: true, message: "Please enter name" }]}
  >
    <Input placeholder={placeholder || "Firstname *"} />
  </Form.Item>
);

export const SurnameInput: React.FC<FormFieldProps> = ({ rules }) => (
  <Form.Item
    name="surname"
    rules={rules || [{ required: true, message: "Please enter surname" }]}
  >
    <Input placeholder="Lastname *" />
  </Form.Item>
);

export const GenderSelect: React.FC<FormFieldProps> = ({ rules }) => (
  <Form.Item name="gender" rules={rules}>
    <Select placeholder="Select gender">
      <Select.Option value="male">Male</Select.Option>
      <Select.Option value="female">Female</Select.Option>
    </Select>
  </Form.Item>
);

export const BirthdatePicker: React.FC<FormFieldProps> = ({ rules }) => (
  <Form.Item name="birthdate" rules={rules}>
    <DatePicker style={{ width: "100%" }} placeholder="Birthdate" />
  </Form.Item>
);

export const EmailInput: React.FC<FormFieldProps> = ({ rules }) => (
  <Form.Item
    name="email"
    rules={
      rules || [
        { required: true, message: "Please enter email" },
        { type: "email", message: "Invalid email format" },
      ]
    }
  >
    <Input placeholder="Email *" />
  </Form.Item>
);

export const PhoneInput: React.FC<FormFieldProps> = ({ rules }) => (
  <Form.Item>
    <Input.Group compact style={{ display: "flex" }}>
      <Form.Item name="countryCode" initialValue="+90" noStyle>
        <Select style={{ width: "30%" }}>
          {countryCodes.map(({ code }) => (
            <Select.Option key={code} value={code}>
              {code}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        rules={
          rules || [{ required: true, message: "Please enter phone number" }]
        }
        noStyle
      >
        <Input
          style={{ width: "70%" }}
          placeholder="Phone No *"
          maxLength={10}
          type="tel"
        />
      </Form.Item>
    </Input.Group>
  </Form.Item>
);

export const LocationInput: React.FC<FormFieldProps> = ({ rules }) => (
  <Form.Item
    name="location"
    rules={rules || []} // Opsiyonel alan
  >
    <Input placeholder="Location" />
  </Form.Item>
);

export const CompanySelect = ({
  companies,
  loading,
  onSearch,
  onSelect,
}: {
  companies: any[];
  loading: boolean;
  onSearch: (text: string) => void;
  onSelect: (id: string) => void;
}) => {
  const isDisabled = !hasRole(["ADMIN"]);
  const defaultCompany = hasRole(["COMPANY_ADMIN", "BRANCH_ADMIN"])
    ? getUser().companyName
    : undefined;

  return (
    <Form.Item
      name="company"
      rules={[{ required: true, message: "Please select company" }]}
      style={{ marginBottom: 8 }}
    >
      <Select
        disabled={isDisabled}
        showSearch
        placeholder="Search and select company"
        filterOption={false}
        onSearch={onSearch}
        onSelect={onSelect}
        loading={loading}
        defaultValue={defaultCompany}
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
  const isDisabled = hasRole(["BRANCH_ADMIN"]);
  const defaultBranch = hasRole(["BRANCH_ADMIN"])
    ? getUser().branchName
    : undefined;

  return (
    <Form.Item
      name="branch"
      rules={[{ required: true, message: "Please select branch" }]}
    >
      <Select
        disabled={isDisabled}
        placeholder="Select branch"
        loading={loading}
        defaultValue={defaultBranch}
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
        loading={loading}
        placeholder="Select job"
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
                  Add new job
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
