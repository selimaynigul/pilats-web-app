import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, DatePicker, Select, Button, Modal, message } from "antd";
import { addTrainerFormItems } from "./add-trainer-form-items";
import { companyService, branchService, jobService } from "services";
import { PlusOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import {
  hasRole,
  getCompanyId,
  getBranchId,
  getUser,
} from "utils/permissionUtils";
import StepModal, { CustomStep, FormRow } from "components/StepModal";
import { useCompanyBranchSelect } from "hooks/useCompanyBranchSelect";
import JobForm from "components/JobForm";
interface AddTrainerFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  loading: boolean;
  form: any;
}

const countryCodes = [
  { code: "+90", country: "TR" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+49", country: "GR" },
  { code: "+33", country: "FR" },
];

const AddTrainerForm: React.FC<AddTrainerFormProps> = ({
  visible,
  onClose,
  onSubmit,
  loading,
  form,
}) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobLoading, setJobLoading] = useState(false);
  const [isAddingJob, setIsAddingJob] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchJobs();
    }
  }, [visible]);

  const {
    companies,
    branches,
    companySearchLoading,
    branchLoading,
    searchCompanies,
    fetchBranches,
  } = useCompanyBranchSelect();

  const fetchJobs = useCallback(async () => {
    setJobLoading(true);
    try {
      const response = await jobService.getAll();
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs");
    } finally {
      setJobLoading(false);
    }
  }, []);

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
  const steps: CustomStep[] = [
    {
      label: "About trainer",
      buttonText: "Save & Continue",
      blocks: [
        {
          title: "Personal Info",
          description: "Provide trainer's personal info",
          fields: [
            <Form.Item name="jobId">
              <Select
                loading={jobLoading}
                placeholder="Select job"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    {isAddingJob ? (
                      <JobForm
                        loading={jobLoading}
                        onCancel={() => setIsAddingJob(false)}
                        onAdded={() => {
                          setIsAddingJob(false);
                          fetchJobs();
                        }}
                      />
                    ) : (
                      <div style={{ padding: "0px 4px 2px 4px" }}>
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => setIsAddingJob(true)}
                          block
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
            </Form.Item>,
            <FormRow>
              <Form.Item {...addTrainerFormItems.name} name="name">
                <Input placeholder="Firstname *" />
              </Form.Item>
              <Form.Item {...addTrainerFormItems.surname} name="surname">
                <Input placeholder="Lastname *" />
              </Form.Item>
            </FormRow>,
            <FormRow>
              <Form.Item {...addTrainerFormItems.gender} name="gender">
                <Select placeholder="Select gender">
                  <Select.Option value="male">Male</Select.Option>
                  <Select.Option value="female">Female</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item {...addTrainerFormItems.birthdate} name="birthdate">
                <DatePicker style={{ width: "100%" }} placeholder="Birthdate" />
              </Form.Item>
            </FormRow>,
          ],
        },
        {
          title: "Contact Info",
          description: "Provide trainer's contact info",
          fields: [
            <FormRow>
              <Form.Item {...addTrainerFormItems.email} name="email">
                <Input type="email" placeholder="Email *" />
              </Form.Item>
              <Form.Item>
                <Input.Group compact style={{ display: "flex" }}>
                  <Form.Item name="countryCode" initialValue="+90" noStyle>
                    <Select className="country-code">
                      {countryCodes.map(({ code, country }) => (
                        <Select.Option key={code} value={code}>
                          {code}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...addTrainerFormItems.phoneNumber}
                    name="phoneNumber"
                  >
                    <Input
                      type="tel"
                      style={{ borderRadius: "0px 8px 8px 0" }}
                      maxLength={10}
                      placeholder="Phone No *"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </FormRow>,
            <Form.Item
              name="location"
              rules={[
                { required: false, message: "Please enter the location" },
              ]}
            >
              <Input placeholder="Location" />
            </Form.Item>,
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
              <Select
                disabled={!hasRole(["ADMIN"])}
                showSearch
                placeholder="Search and select company"
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
            <Form.Item {...addTrainerFormItems.branch} name="branch">
              <Select
                disabled={hasRole(["BRANCH_ADMIN"])}
                placeholder="Select branch"
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
      title="Add Trainer"
      steps={steps}
      loading={loading}
      form={form}
    />
  );
};

export default AddTrainerForm;
