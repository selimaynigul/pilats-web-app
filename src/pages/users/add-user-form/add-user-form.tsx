import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Modal, message } from "antd";
import { addTrainerFormItems } from "./add-user-form-items";
import { companyService, branchService, jobService } from "services";
import { PlusOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
interface AddTrainerFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const AddUserForm: React.FC<AddTrainerFormProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [companySearchLoading, setCompanySearchLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [newJobName, setNewJobName] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [jobLoading, setJobLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
}, []);

const fetchJobs = async () => {
  setJobLoading(true);
  try {
    const response = await jobService.getAll(); // Implement this API call
    setJobs(response.data);
  } catch (error) {
    message.error('Failed to fetch jobs');
  } finally {
    setJobLoading(false);
  }
};

const handleAddNewJob = async () => {
  try {
    if(!newJobName) return message.error('Please enter a job name');
    if(!newJobDesc) return message.error('Please enter a job name');
    await jobService.add({ 
        jobName:newJobName,
        jobDesc:"Designs, develops, tests and deploys software products."
    }); 
    message.success('Job added successfully');
    setIsAddingJob(false);
    setNewJobName('');
    setNewJobDesc('');
    fetchJobs(); // Refresh jobs list
  } catch (error) {
    message.error('Failed to add job');
  }
};

  const handleCompanySearch = async (value: string) => {
    if (!value) return;
    setCompanySearchLoading(true);
    try {
      const res = await companyService.search({ companyName: value });
      setCompanies(res.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setCompanySearchLoading(false);
    }
  };

  const handleCompanySelect = async (companyId: string) => {
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

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields();
      })
      .catch((info) => {
        console.error("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title="Add User"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item {...addTrainerFormItems.name} name="name">
          <Input placeholder="Enter trainer's name" />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.surname} name="surname">
          <Input placeholder="Enter trainer's surname" />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.title} name="title">
          <Input placeholder="Enter trainer's title" />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.company} name="company">
          <Select
            showSearch
            placeholder="Search and select company"
            filterOption={false}
            onSearch={handleCompanySearch}
            onSelect={handleCompanySelect}
            loading={companySearchLoading}
          >
            {companies.map((company: any) => (
              <Select.Option key={company.id} value={company.id}>
                {company.companyName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
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
        <Form.Item {...addTrainerFormItems.birthdate} name="birthdate">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.gender} name="gender">
          <Select placeholder="Select gender">
            <Select.Option value="male">MALE</Select.Option>
            <Select.Option value="female">FEMALE</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item {...addTrainerFormItems.email} name="email">
          <Input placeholder="Enter email address" />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.phoneNumber} name="phoneNumber">
          <Input placeholder="Enter phone number" />
        </Form.Item>
 <Form.Item
              name="jobId"
              label="Job"
              rules={[{ required: true, message: "Please select or add a job" }]}
            >
          {isAddingJob ? (
            <Input.Group compact>
              <Input 
                style={{ width: 'calc(100% - 90px)' }}
                value={newJobName}
                onChange={(e) => setNewJobName(e.target.value)}
                placeholder="Enter new job name"
              />
              <Input 
                style={{ width: 'calc(100% - 90px)', marginTop: '7px', marginBottom: '7px' }}
                value={newJobDesc}
                onChange={(e) => setNewJobDesc(e.target.value)}
                placeholder="Enter new job description"
              />
              <br/>
              <Button 
                type="primary" 
                onClick={handleAddNewJob}
                loading={jobLoading}
              >
                Add
              </Button>
              <Button 
                onClick={() => setIsAddingJob(false)}
                style={{ marginLeft: '8px' }}
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
                  <Divider style={{ margin: '8px 0' }} />
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
              {jobs.map(job => (
                <Select.Option key={job.id} value={job.id}>
                  {job.jobName}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
          < Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: "Please enter the location" }]}
              >
                <Input />
              </Form.Item>
              
        <Form.Item>
          <Button type="primary" htmlType="submit">
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

export default AddUserForm;
