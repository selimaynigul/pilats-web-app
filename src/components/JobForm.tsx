import React from "react";
import { Button, Form, Input, message } from "antd";

interface JobFormProps {
  loading: boolean;
  onCancel: () => void;
  onAdded: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ loading, onCancel, onAdded }) => {
  const [form] = Form.useForm();

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      await import("services").then(({ jobService }) =>
        jobService.add({
          jobName: values.jobName,
          jobDesc: values.jobDesc,
        })
      );
      message.success("Job added successfully");
      form.resetFields();
      onAdded();
    } catch (err: any) {
      if (err?.response?.data.errorCode === 1602) {
        message.warning("Bu isimde bir job zaten var");
      } else {
        message.error("Failed to add job");
      }
    }
  };

  return (
    <div style={{ padding: "8px" }}>
      <Form form={form} layout="vertical" variant="filled">
        <Form.Item
          style={{ marginBottom: "8px" }}
          name="jobName"
          rules={[{ required: true, message: "Please enter a job name" }]}
        >
          <Input placeholder="Job Name *" />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: "16px" }}
          name="jobDesc"
          rules={[
            { required: true, message: "Please enter a job description" },
          ]}
        >
          <Input placeholder="Job Description *" />
        </Form.Item>
        <div style={{ textAlign: "right" }}>
          <Button
            type="primary"
            size="small"
            onClick={handleAdd}
            loading={loading}
          >
            Add
          </Button>
          <Button size="small" onClick={onCancel} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default JobForm;
