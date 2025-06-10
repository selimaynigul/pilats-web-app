import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Modal } from "antd";
import { companyService, branchService } from "services";
import { hasRole, getCompanyId } from "utils/permissionUtils";
interface AddAdminModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  isBranchMode: boolean;
  form: any;
}

const AddAdminModal: React.FC<AddAdminModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isBranchMode,
  form,
}) => {
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [companySearchLoading, setCompanySearchLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);

  useEffect(() => {
    if (isBranchMode && hasRole(["COMPANY_ADMIN"])) {
      const companyId = getCompanyId();
      if (companyId) {
        form.setFieldsValue({ company: companyId });
        fetchBranches(companyId);
      }
    }
  }, [isBranchMode, form]);

  const handleCompanySearch = async (value: string) => {
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
    fetchBranches(companyId);
  };

  const fetchBranches = async (companyId: string) => {
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
      .then((values: any) => {
        onSubmit(values);
      })
      .catch((info: any) => {
        console.error("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title={isBranchMode ? "Add Branch Admin" : "Add Company Admin"}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        variant="filled"
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item name="name" label="First Name" rules={[{ required: true }]}>
          <Input placeholder="Enter first name" />
        </Form.Item>
        <Form.Item
          name="surname"
          label="Last Name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>
        <Form.Item name="birthdate" label="Birthdate">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="gender" label="Gender">
          <Select placeholder="Select gender">
            <Select.Option value="MALE">Male</Select.Option>
            <Select.Option value="FEMALE">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="phoneNumber" label="Phone Number">
          <Input placeholder="Enter phone number" />
        </Form.Item>
        {!hasRole(["COMPANY_ADMIN"]) && (
          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              placeholder="Search and select company"
              filterOption={false}
              onSearch={handleCompanySearch}
              onSelect={handleCompanySelect}
              loading={companySearchLoading}
              onFocus={() => handleCompanySearch("")}
            >
              {companies.map((company: any) => (
                <Select.Option key={company.id} value={company.id}>
                  {company.companyName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {isBranchMode && (
          <Form.Item name="branch" label="Branch" rules={[{ required: true }]}>
            <Select placeholder="Select branch" loading={branchLoading}>
              {branches.map((branch: any) => (
                <Select.Option key={branch.id} value={branch.id}>
                  {branch.branchName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
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

export default AddAdminModal;
