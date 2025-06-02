import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Modal, message } from "antd";
import { addTrainerFormItems } from "./add-trainer-form-items";
import { companyService, branchService, jobService } from "services";
import { PlusOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import { hasRole, getCompanyId, getBranchId } from "utils/permissionUtils";
interface AddTrainerFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  loading: boolean;
  company?: any;
  form: any;
}

const AddTrainerForm: React.FC<AddTrainerFormProps> = ({
  visible,
  onClose,
  onSubmit,
  loading,
  company,
  form,
}) => {
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [companySearchLoading, setCompanySearchLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [newJobName, setNewJobName] = useState("");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [jobLoading, setJobLoading] = useState(false);

  useEffect(() => {
    if (hasRole(["ADMIN"])) {
      handleCompanySearch("All");
    } else if (hasRole(["COMPANY_ADMIN"])) {
      fetchBranches(getCompanyId());
    }
    fetchJobs();
  }, []);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setBranches([]); // şube listesini temizle
    }
  }, [visible]);

  /*  useEffect(() => {
    // ADMIN ise tüm şirketler aransın
    if (hasRole(["ADMIN"])) {
      handleCompanySearch("All");
    }

    // company prop geldiyse formda otomatik setle
    if (company?.id || company?.companyParam) {
      form.setFieldsValue({ company: company.id });
      fetchBranches(company.id);
    }

    fetchJobs();
  }, [company]); */

  const fetchBranches = async (companyId: string) => {
    if (!companyId) return;
    setBranchLoading(true);
    try {
      const res = await branchService.search({ companyId });
      setBranches(res.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setBranchLoading(false);
    }
  };

  const handleCompanySearch = async (value: string) => {
    let companyName;
    if (value === "All") {
      companyName = null;
    } else {
      companyName = value;
    }
    setCompanySearchLoading(true);
    try {
      const res = await companyService.search({ companyName });
      setCompanies(res.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setCompanySearchLoading(false);
    }
  };

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
        form.resetFields();
      })
      .catch((info: any) => {
        console.error("Validation Failed:", info);
      });
  };

  return (
    <Modal title="Add Trainer" open={visible} onCancel={onClose} footer={null}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        variant="filled"
      >
        <Form.Item {...addTrainerFormItems.name} name="name">
          <Input placeholder="Enter trainer's name" />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.surname} name="surname">
          <Input placeholder="Enter trainer's surname" />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.email} name="email">
          <Input placeholder="Enter email address" />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.phoneNumber} name="phoneNumber">
          <Input placeholder="Enter phone number" />
        </Form.Item>
        {!hasRole(["COMPANY_ADMIN", "BRANCH_ADMIN"]) && (
          <Form.Item {...addTrainerFormItems.company} name="company">
            <Select
              showSearch
              placeholder="Search and select company"
              filterOption={false}
              onSearch={handleCompanySearch}
              onSelect={(value) => fetchBranches(value)}
              loading={companySearchLoading}
            >
              {companies.map((company: any) => (
                <Select.Option key={company.id} value={company.id}>
                  {company.companyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {!hasRole(["BRANCH_ADMIN"]) && (
          <Form.Item {...addTrainerFormItems.branch} name="branch">
            <Select
              placeholder="Select branch"
              loading={branchLoading}
              disabled={!branches.length}
            >
              {branches.map((branch: any) => (
                <Select.Option key={branch.id} value={branch.id}>
                  {branch.branchName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item {...addTrainerFormItems.birthdate} name="birthdate">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.gender} name="gender">
          <Select placeholder="Select gender">
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="jobId"
          label="Job"
          rules={[{ required: false, message: "Please select or add a job" }]}
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
        </Form.Item>
        <Form.Item
          name="location"
          label="Location"
          rules={[{ required: false, message: "Please enter the location" }]}
        >
          <Input placeholder="Location" />
        </Form.Item>

        <Form.Item>
          <Button
            onClick={handleSubmit}
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>

          <Button style={{ marginLeft: "10px" }} onClick={onClose}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTrainerForm;
