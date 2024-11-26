// Toolbar.tsx

import React, { useState } from "react";
import {
  ToolbarContainer,
  NavButtons,
  TitleButton,
  CompanyDropdownButton,
  IconWrapper,
  ActionButton,
  ToggleViewButton,
} from "./ToolbarStyles";
import { RightOutlined, LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { IoIosArrowDown } from "react-icons/io";
import { ToolbarProps, View } from "react-big-calendar";
import {
  Dropdown,
  Menu,
  Select,
  DatePicker,
  Input,
  Modal,
  Button,
  Form,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import AddButton from "components/AddButton";

const Toolbar: React.FC<ToolbarProps> = ({
  label,
  onNavigate,
  onView,
  views,
  view,
  date,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs(date).month());
  const [selectedYear, setSelectedYear] = useState(dayjs(date).year());
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const currentYear = dayjs().year();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleDateNavigation = (month: number, year: number) => {
    const newDate = dayjs().year(year).month(month).startOf("month").toDate();
    onNavigate("DATE", newDate);
  };

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

  const companyMenu = (
    <Menu>
      <Menu.Item key="search">
        <Input
          placeholder="Search Company"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Menu.Item>
      {[
        "Tech Corp - New York",
        "Eco Energy - San Francisco",
        "Health Solutions - Los Angeles",
      ]
        .filter((company) =>
          company.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((company, index) => (
          <Menu.Item
            key={index}
            onClick={() => console.log(`Selected: ${company}`)}
          >
            {company}
          </Menu.Item>
        ))}
    </Menu>
  );

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
        <Dropdown
          overlay={
            <Menu>
              <Menu.ItemGroup title="Select Month">
                {Array.from({ length: 12 }, (_, i) => (
                  <Menu.Item key={i} onClick={() => setSelectedMonth(i)}>
                    {dayjs().month(i).format("MMMM")}
                  </Menu.Item>
                ))}
              </Menu.ItemGroup>
              <Menu.Divider />
              <Menu.ItemGroup title="Select Year">
                <Select
                  value={selectedYear}
                  onChange={(year) => setSelectedYear(year)}
                >
                  {yearOptions.map((year) => (
                    <Select.Option key={year} value={year}>
                      {year}
                    </Select.Option>
                  ))}
                </Select>
              </Menu.ItemGroup>
            </Menu>
          }
        >
          <TitleButton>{dayjs(date).format("MMMM YYYY")}</TitleButton>
        </Dropdown>
      </NavButtons>

      <Dropdown overlay={companyMenu} trigger={["click"]}>
        <CompanyDropdownButton>
          MacFit - Gebze
          <IconWrapper>
            <IoIosArrowDown />
          </IconWrapper>
        </CompanyDropdownButton>
      </Dropdown>

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
