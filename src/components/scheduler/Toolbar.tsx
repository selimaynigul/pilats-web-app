import React, { useState } from "react";
import styled from "styled-components";
import {
  RightOutlined,
  LeftOutlined,
  PlusOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { ToolbarProps } from "react-big-calendar";
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
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { IoIosArrowDown } from "react-icons/io";

const StyledContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 50px;
  padding: 10px;
`;

const Nav = styled.div`
  display: flex;
  gap: 5px;
`;

const Title = styled.button`
  margin: 0;
  height: 35px;
  padding: 5px 15px;
  color: #4d3abd;
  cursor: pointer;
  background: transparent;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  border-radius: 50px;
  border: none;
  transition: 0.2s;

  &:hover {
    background: #f6f5ff;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;
const CompanyName = styled.button`
  position: relative;
  margin: 0;
  border: none;
  height: 35px;
  padding: 5px 15px;
  color: #4d3abd;
  cursor: pointer;
  background: transparent;
  display: flex;
  align-items: center;
  font-weight: bold;
  border: 1px solid #4d3abd;
  border-radius: 50px;
  transition: padding-right 0.3s ease;

  &:hover {
    padding-right: 35px; /* Adds space for the icon when hovered */
  }
`;

const IconContainer = styled.div`
  position: absolute;
  right: 15px;
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(10px);
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;

  ${CompanyName}:hover & {
    opacity: 1;
    transform: translateX(0); /* Slide in the icon */
  }
`;
const StyledButton = styled.button`
  border: 1px solid transparent;
  background: ${({ theme }) => theme.contentBg};
  color: #4d3abd;
  border-radius: 50px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    border: 1px solid #4d3abd;
  }
`;
const AddButton = styled(StyledButton)`
  border: none;
  &:hover {
    border: none;
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.9);
  }
`;

const StyledButton2 = styled(StyledButton)`
  width: fit-content;
  padding: 5px 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 5px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const CustomToolbar: React.FC<ToolbarProps> = ({
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

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    navigateToDate(month, selectedYear);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    navigateToDate(selectedMonth, year);
  };

  const navigateToDate = (month: number, year: number) => {
    const newDate = dayjs().year(year).month(month).startOf("month").toDate();
    onNavigate("DATE", newDate);
  };

  const mockCompanies = [
    { name: "Tech Corp - New York" },
    { name: "Eco Energy - San Francisco" },
    { name: "Health Solutions - Los Angeles" },
  ];

  const filteredCompanies = mockCompanies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const companyDropdown = (
    <Menu>
      <Menu.Item key="search">
        <Input
          placeholder="Search Company"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Menu.Item>
      {filteredCompanies.map((company, index) => (
        <Menu.Item
          key={index}
          onClick={() => console.log(`Selected: ${company.name}`)}
        >
          {company.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const monthYearMenu = (
    <Menu>
      <Menu.ItemGroup title="Select Month">
        {Array.from({ length: 12 }, (_, i) => (
          <Menu.Item key={i} onClick={() => handleMonthChange(i)}>
            {dayjs().month(i).format("MMMM")}
          </Menu.Item>
        ))}
      </Menu.ItemGroup>
      <Menu.Divider />
      <Menu.ItemGroup title="Select Year">
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          style={{ width: "100%" }}
        >
          {yearOptions.map((year) => (
            <Select.Option key={year} value={year}>
              {year}
            </Select.Option>
          ))}
        </Select>
      </Menu.ItemGroup>
    </Menu>
  );

  const getTitleDropdown = () => {
    if (view === "month") {
      return (
        <Dropdown overlay={monthYearMenu} trigger={["click"]}>
          <Title>{dayjs(date).format("MMMM YYYY")}</Title>
        </Dropdown>
      );
    } else if (view === "week") {
      return (
        <Dropdown
          overlay={
            <DatePicker
              picker="week"
              onChange={(value: Dayjs | null) => {
                if (value) onNavigate("DATE", value.startOf("week").toDate());
              }}
              bordered={false}
              style={{ padding: 0, border: 0, fontSize: "inherit" }}
            />
          }
          trigger={["click"]}
        >
          <Title>
            {dayjs(date).startOf("week").format("MMM D")} -{" "}
            {dayjs(date).endOf("week").format("MMM D, YYYY")}
          </Title>
        </Dropdown>
      );
    } else if (view === "day") {
      return (
        <Dropdown
          overlay={
            <DatePicker
              onChange={(value: Dayjs | null) => {
                if (value) onNavigate("DATE", value.toDate());
              }}
              bordered={false}
              style={{ padding: 0, border: 0, fontSize: "inherit" }}
            />
          }
          trigger={["click"]}
        >
          <Title>{dayjs(date).format("dddd, MMM D, YYYY")}</Title>
        </Dropdown>
      );
    } else {
      return <Title>{label}</Title>;
    }
  };

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddClass = () => {
    form
      .validateFields()
      .then((values: any) => {
        console.log("Class Data:", values);
        handleModalClose();
      })
      .catch((info: any) => {
        console.log("Validate Failed:", info);
      });
  };

  const trainerOptions = [
    { label: "Alice Johnson", value: "alice" },
    { label: "Bob Smith", value: "bob" },
    { label: "Charlie Brown", value: "charlie" },
  ];

  return (
    <StyledContainer className="custom-toolbar">
      <Nav>
        <ButtonContainer>
          <StyledButton2 onClick={() => onNavigate("TODAY")}>
            Today
          </StyledButton2>
          <StyledButton onClick={() => onNavigate("PREV")}>
            <LeftOutlined />
          </StyledButton>
          <StyledButton onClick={() => onNavigate("NEXT")}>
            <RightOutlined />
          </StyledButton>
        </ButtonContainer>

        {getTitleDropdown()}
      </Nav>

      <Dropdown overlay={companyDropdown} trigger={["click"]}>
        <CompanyName>
          MacFit - Gebze
          <IconContainer className="icon">
            <IoIosArrowDown />
          </IconContainer>
        </CompanyName>
      </Dropdown>

      <Nav>
        <ButtonContainer>
          {views.map((v: any) => (
            <StyledButton2
              key={v}
              onClick={() => onView(v)}
              style={{
                fontWeight: view === v ? "bold" : "normal",
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </StyledButton2>
          ))}
        </ButtonContainer>
        <AddButton
          style={{ background: "#5d46e5", color: "white" }}
          onClick={handleModalOpen}
        >
          <PlusOutlined />
        </AddButton>
      </Nav>

      <Modal
        title="Add New Class"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="cancel" onClick={handleModalClose}>
            Cancel
          </Button>,
          <Button key="add" type="primary" onClick={handleAddClass}>
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
    </StyledContainer>
  );
};

export default CustomToolbar;
