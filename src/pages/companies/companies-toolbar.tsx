import React, { useState } from "react";
import styled from "styled-components";
import AddButton from "components/AddButton";
import { Modal, Form, Input, message } from "antd";
import { companyService } from "services";
import { handleError } from "utils/apiHelpers";
import { useNavigate } from "react-router-dom";

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const CountContainer = styled.div`
  font-size: 16px;
  font-weight: bold;
  height: 50px;
  background: white;
  padding: 10px 20px;
  gap: 6px;
  border-radius: 50px;
  display: flex;
  align-items: center;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 8px;
  background: white;
  height: 50px;
  border-radius: 50px;
  align-items: center;
  padding: 10px;
`;

const CountNumber = styled.span`
  color: ${({ theme }) => theme.primary}; /* Primary color for the number */
`;

const CompaniesToolbar: React.FC<{
  trainerCount: number;
}> = ({ trainerCount }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleAddCompany = (values: any) => {
    companyService
      .add(values)
      .then(() => {
        message.success("Company updated successfully");
        setIsModalVisible(false);
        form.resetFields();
        navigate("/companies");
      })
      .catch((err) => {
        console.error("Error updating company:", err);
        handleError(err);
      });
  };

  return (
    <ToolbarContainer>
      <CountContainer>
        <CountNumber>{trainerCount}</CountNumber> companies listed
      </CountContainer>
      <ActionContainer>
        <AddButton onClick={() => setIsModalVisible(true)} />
      </ActionContainer>
      <Modal
        title="Update Company"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          form.validateFields().then(handleAddCompany).catch(console.error);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[
              { required: true, message: "Please enter the company name" },
            ]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>
          <Form.Item
            name="telNo"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter the phone number" },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="mail"
            label="Email"
            rules={[
              { required: true, message: "Please enter the email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
        </Form>
      </Modal>
    </ToolbarContainer>
  );
};

export default CompaniesToolbar;
