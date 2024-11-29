import React, { useState } from "react";
import {
  ToolbarContainer,
  NavButtons,
  TitleButton,
  ActionButton,
  ToggleViewButton,
} from "./ToolbarStyles";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { DatePicker, Modal, Button, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import AddButton from "components/AddButton";
import { CompanyDropdown } from "components";
import { ToolbarProps, View } from "react-big-calendar";

const Toolbar: React.FC<ToolbarProps> = ({
  label,
  onNavigate,
  onView,
  views,
  view,
  date,
}) => {
  const [selectedCompany, setSelectedCompany] = useState("MacFit - Gebze");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleModalToggle = (visible: boolean) => {
    setIsModalVisible(visible);
    if (!visible) form.resetFields();
  };

  const handleClassSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Class Data:", values);
        handleModalToggle(false);
      })
      .catch((info) => console.log("Validation Failed:", info));
  };

  const trainerOptions = [
    { label: "Alice Johnson", value: "alice" },
    { label: "Bob Smith", value: "bob" },
    { label: "Charlie Brown", value: "charlie" },
  ];

  const viewArray = Array.isArray(views)
    ? views
    : (Object.keys(views).filter(
        (key) => views[key as keyof typeof views]
      ) as View[]);

  return (
    <ToolbarContainer>
      <NavButtons>
        <ToggleViewButton onClick={() => onNavigate("TODAY")}>
          Today
        </ToggleViewButton>
        <ActionButton onClick={() => onNavigate("PREV")}>
          <LeftOutlined />
        </ActionButton>
        <ActionButton onClick={() => onNavigate("NEXT")}>
          <RightOutlined />
        </ActionButton>
        <TitleButton>{dayjs(date).format("MMMM YYYY")}</TitleButton>
      </NavButtons>

      <CompanyDropdown
        selectedCompany={selectedCompany}
        onCompanySelect={(company) => setSelectedCompany(company)}
      />

      <NavButtons>
        {viewArray.map((v: any) => (
          <ToggleViewButton
            key={v}
            onClick={() => onView(v)}
            style={{ fontWeight: view === v ? "bold" : "normal" }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </ToggleViewButton>
        ))}
        <AddButton onClick={() => handleModalToggle(true)} />
      </NavButtons>

      <Modal
        title="Add New Class"
        visible={isModalVisible}
        onCancel={() => handleModalToggle(false)}
        footer={[
          <Button key="cancel" onClick={() => handleModalToggle(false)}>
            Cancel
          </Button>,
          <Button key="add" type="primary" onClick={handleClassSubmit}>
            Add
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="className"
            label="Class Name"
            rules={[{ required: true, message: "Please enter the class name" }]}
          >
            <Input placeholder="Enter class name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[
              { required: true, message: "Please select the start date" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select the end date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="trainer"
            label="Trainer"
            rules={[{ required: true, message: "Please select a trainer" }]}
          >
            <Select
              showSearch
              placeholder="Select a trainer"
              options={trainerOptions}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </ToolbarContainer>
  );
};

export default Toolbar;
