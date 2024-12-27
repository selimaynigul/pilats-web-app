import React, { useState } from "react";
import { Form, Input, DatePicker, Select, Button, Modal } from "antd";
import { addTrainerFormItems } from "./add-user-form-items";
import { companyService, branchService } from "services";

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
      const res = await branchService.getByPagination({ companyId });
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
        console.log("vasdasdg: ", values);
        onSubmit(values);
        form.resetFields();
      })
      .catch((info) => {
        console.error("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title="Add Trainer"
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
