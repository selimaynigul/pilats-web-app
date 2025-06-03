import React, { useState } from "react";
import { Form, Input, InputNumber, Select, Button, Modal, Switch } from "antd";
import { companyService, branchService } from "services";

interface AddPackageFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  form: any;
}

const AddPackageForm: React.FC<AddPackageFormProps> = ({
  visible,
  onClose,
  onSubmit,
  form,
}) => {
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const [companySearchLoading, setCompanySearchLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(false);
  const [isBranchSpecific, setIsBranchSpecific] = useState(false);

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
      title="Add Package"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        variant="filled"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter the package name" }]}
        >
          <Input placeholder="Enter package name" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please enter the price" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Enter price"
          />
        </Form.Item>

        <Form.Item
          label="Credit Count"
          name="creditCount"
          rules={[{ required: true, message: "Please enter the credit count" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Enter credit count"
          />
        </Form.Item>

        <Form.Item
          label="Discount"
          name="discount"
          rules={[{ required: true, message: "Please enter the discount" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            max={1}
            step={0.01}
            placeholder="Enter discount (e.g., 0.2 for 20%)"
          />
        </Form.Item>

        <Form.Item
          label="Bonus Count"
          name="bonusCount"
          rules={[{ required: true, message: "Please enter the bonus count" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Enter bonus count"
          />
        </Form.Item>

        <Form.Item
          label="Change Count"
          name="changeCount"
          rules={[{ required: true, message: "Please enter the change count" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Enter change count"
          />
        </Form.Item>

        <Form.Item
          label="Company"
          name="companyId"
          rules={[{ required: true, message: "Please select a company" }]}
        >
          <Select
            showSearch
            placeholder="Search and select company"
            filterOption={false}
            onSearch={handleCompanySearch}
            onSelect={handleCompanySelect}
            onFocus={() => {
              handleCompanySearch("");
            }}
            loading={companySearchLoading}
          >
            {companies.map((company: any) => (
              <Select.Option key={company.id} value={company.id}>
                {company.companyName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Is Branch Specific"
          name="isBranchSpecific"
          valuePropName="checked"
        >
          <Switch
            checked={isBranchSpecific}
            onChange={(checked) => {
              setIsBranchSpecific(checked);
              if (!checked) {
                form.setFieldsValue({ branchId: null });
              }
            }}
          />
        </Form.Item>

        {isBranchSpecific && (
          <Form.Item
            label="Branch"
            name="branchId"
            rules={[{ required: true, message: "Please select a branch" }]}
          >
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

export default AddPackageForm;
