import React from "react";
import { Form, Input, DatePicker, Select, Button, Modal } from "antd";
import { addTrainerFormItems } from "./add-trainer-form-items";

interface AddTrainerFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const AddTrainerForm: React.FC<AddTrainerFormProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields(); // Reset form after successful submission
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
        <Form.Item {...addTrainerFormItems.name}>
          <Input placeholder="Enter trainer's name" />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.surname}>
          <Input placeholder="Enter trainer's surname" />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.title}>
          <Input placeholder="Enter trainer's title" />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.company}>
          <Select placeholder="Select company">
            <Select.Option value="company1">Company 1</Select.Option>
            <Select.Option value="company2">Company 2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item {...addTrainerFormItems.branch}>
          <Select placeholder="Select branch">
            <Select.Option value="branch1">Branch 1</Select.Option>
            <Select.Option value="branch2">Branch 2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item {...addTrainerFormItems.birthdate}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.gender}>
          <Select placeholder="Select gender">
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item {...addTrainerFormItems.email}>
          <Input placeholder="Enter email address" />
        </Form.Item>
        <Form.Item {...addTrainerFormItems.phoneNumber}>
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

export default AddTrainerForm;
