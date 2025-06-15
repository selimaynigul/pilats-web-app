import React, { useState, useEffect } from "react";
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
  const [jobs, setJobs] = useState<any[]>([]);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [newJobName, setNewJobName] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [jobLoading, setJobLoading] = useState(false);

  const {
    companies,
    branches,
    companySearchLoading,
    branchLoading,
    searchCompanies,
    fetchBranches,
  } = useCompanyBranchSelect();

  const fetchJobs = async () => {
    setJobLoading(true);
    try {
      const response = await jobService.getAll();
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs");
    } finally {
      setJobLoading(false);
    }
  };

  const handleAddNewJob = async () => {
    try {
      if (!newJobName) return message.error("Please enter a job name");
      if (!newJobDesc) return message.error("Please enter a job description");
      await jobService.add({
        jobName: newJobName,
        jobDesc: newJobDesc,
      });
      message.success("Job added successfully");
      setIsAddingJob(false);
      setNewJobName("");
      setNewJobDesc("");
      fetchJobs();
    } catch (error) {
      message.error("Failed to add job");
    }
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values: any) => {
        let modifiedValues = values;

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
            <Form.Item
              name="jobId"
              rules={[
                { required: false, message: "Please select or add a job" },
              ]}
            >
              {isAddingJob ? (
                <Input.Group compact>
                  <Input
                    style={{ width: "calc(100% - 90px)" }}
                    value={newJobName}
                    onChange={(e) => setNewJobName(e.target.value)}
                    placeholder="Enter new job name"
                  />
                  <Input
                    style={{
                      width: "calc(100% - 90px)",
                      marginTop: "7px",
                      marginBottom: "7px",
                    }}
                    value={newJobDesc}
                    onChange={(e) => setNewJobDesc(e.target.value)}
                    placeholder="Enter new job description"
                  />
                  <br />
                  <Button
                    type="primary"
                    onClick={handleAddNewJob}
                    loading={jobLoading}
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => setIsAddingJob(false)}
                    style={{ marginLeft: "8px" }}
                  >
                    Cancel
                  </Button>
                </Input.Group>
              ) : (
                <Select
                  loading={jobLoading}
                  placeholder="Select job"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddingJob(true)}
                        style={{ paddingLeft: 8 }}
                      >
                        Add new job
                      </Button>
                    </>
                  )}
                >
                  {jobs.map((job) => (
                    <Select.Option key={job.id} value={job.id}>
                      {job.jobName}
                    </Select.Option>
                  ))}
                </Select>
              )}
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
                <Input placeholder="Email *" />
              </Form.Item>
              <Form.Item
                {...addTrainerFormItems.phoneNumber}
                name="phoneNumber"
              >
                <Input placeholder="Phone No *" />
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
