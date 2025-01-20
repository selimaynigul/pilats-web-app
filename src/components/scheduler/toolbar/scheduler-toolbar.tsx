import React, { useState } from "react";
import {
  ToolbarContainer,
  NavButtons,
  ActionButton,
  ToggleViewButton,
} from "./ToolbarStyles";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Form, ConfigProvider, DatePicker } from "antd";
import dayjs from "dayjs";
import AddButton from "components/AddButton";
import { CompanyDropdown } from "components";
import { ToolbarProps, View } from "react-big-calendar";
import { capitalize, hasRole } from "utils/permissionUtils";
import styled from "styled-components";
import { useLanguage } from "hooks";
import enUS from "antd/es/locale/en_US";
import trTR from "antd/es/locale/tr_TR";
import "dayjs/locale/tr"; // Import Turkish locale
import "dayjs/locale/en"; // Import English locale

// Styled components
const StyledDatePicker = styled(DatePicker)`
  margin: 0;
  height: 35px;
  color: #4d3abd;
  background: transparent;
  border-radius: 50px;
  border: none;
  transition: background 0.2s;
  cursor: pointer;

  &:hover {
    background: #f6f5ff;
  }

  .ant-picker-input > input {
    text-align: center; /* Center align the text */
    color: #5d46e5; /* Customize the text color */
    font-size: 16px;
  }

  .ant-picker-focused {
    border-color: #5d46e5; /* Focus border color */
    box-shadow: 0 0 5px rgba(93, 70, 229, 0.5); /* Optional glow */
  }

  .ant-picker-clear {
    display: none;
  }
`;

const Toolbar: React.FC<
  ToolbarProps & { company: any; setCompany: any; setIsModalVisible: any }
> = React.memo(
  ({
    onNavigate,
    onView,
    views,
    view,
    date,
    setCompany,
    company,
    setIsModalVisible,
  }) => {
    const [form] = Form.useForm();
    const { t, userLanguage } = useLanguage();
    dayjs.locale(userLanguage);

    const currentLocale = userLanguage === "tr" ? trTR : enUS;

    const handleModalToggle = (visible: boolean) => {
      setIsModalVisible(visible);
      if (!visible) form.resetFields();
    };

    const viewArray = Array.isArray(views)
      ? views
      : (Object.keys(views).filter(
          (key) => views[key as keyof typeof views]
        ) as View[]);

    const handleDateChange = (date: unknown, dateString: string | string[]) => {
      if (dayjs.isDayjs(date)) {
        onNavigate("DATE", date.toDate());
      } else {
        console.warn("Invalid date format received", date);
      }
    };

    return (
      <ToolbarContainer>
        <NavButtons>
          <ToggleViewButton onClick={() => onNavigate("TODAY")}>
            {t.today}
          </ToggleViewButton>
          <ActionButton onClick={() => onNavigate("PREV")}>
            <LeftOutlined />
          </ActionButton>
          <ActionButton onClick={() => onNavigate("NEXT")}>
            <RightOutlined />
          </ActionButton>
          <ConfigProvider locale={currentLocale}>
            <StyledDatePicker
              picker="month"
              value={dayjs(date)}
              onChange={handleDateChange}
              suffixIcon={null}
              format="MMMM YYYY"
              style={{ width: "100%" }}
            />
          </ConfigProvider>
        </NavButtons>
        <div>
          {hasRole(["ADMIN", "COMPANY_ADMIN"]) && (
            <CompanyDropdown
              selectedItem={company}
              onSelect={(selectedCompany) => setCompany(selectedCompany)}
            />
          )}
        </div>
        <NavButtons>
          {viewArray.map((v: any) => (
            <ToggleViewButton
              key={v}
              onClick={() => onView(v)}
              style={{ fontWeight: view === v ? "bold" : "normal" }}
            >
              {t["calendar"][v] || capitalize(v)}
            </ToggleViewButton>
          ))}
          {hasRole(["BRANCH_ADMIN"]) && (
            <AddButton onClick={() => handleModalToggle(true)} />
          )}
        </NavButtons>
      </ToolbarContainer>
    );
  }
);

Toolbar.displayName = "Toolbar";

export default Toolbar;
