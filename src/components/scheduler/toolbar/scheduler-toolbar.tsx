import React, { useEffect, useState } from "react";
import {
  ToolbarContainer,
  NavButtons,
  ActionButton,
  ToggleViewButton,
} from "./ToolbarStyles";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Form, ConfigProvider, DatePicker, Tooltip } from "antd";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import AddButton from "components/AddButton";
import { CompanyDropdown } from "components";
import { ToolbarProps, View } from "react-big-calendar";
import { hasRole } from "utils/permissionUtils";
import styled from "styled-components";
import { TbLayoutList } from "react-icons/tb";

import { useLanguage } from "hooks";
import enUS from "antd/es/locale/en_US";
import trTR from "antd/es/locale/tr_TR";
import "dayjs/locale/tr";
import "dayjs/locale/en";
import {
  MdOutlineCalendarViewMonth,
  MdOutlineCalendarViewWeek,
  MdOutlineViewDay,
} from "react-icons/md";
import { Dropdown, MenuProps } from "antd";
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

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

const MobileRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
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

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth <= 1024);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleModalToggle = (visible: boolean) => {
      setIsModalVisible(visible);
      if (!visible) form.resetFields();
    };

    const viewOptions: { key: View; icon: React.ReactNode; label: string }[] = [
      {
        key: "month",
        icon: <MdOutlineCalendarViewMonth />,
        label: t["calendar"]?.month || "Month",
      },
      {
        key: "week",
        icon: <MdOutlineCalendarViewWeek />,
        label: t["calendar"]?.week || "Week",
      },
      {
        key: "day",
        icon: <MdOutlineViewDay />,
        label: t["calendar"]?.day || "Day",
      },
      {
        key: "agenda",
        icon: <TbLayoutList />,
        label: t["calendar"]?.agenda || "Agenda",
      },
    ];

    const items: MenuProps["items"] = viewOptions.map((item) => ({
      key: item.key,
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {item.icon}
          <span>{item.label}</span>
        </div>
      ),
      onClick: () => onView(item.key),
    }));

    const getPickerType = () => {
      if (view === "day") return "date";
      if (view === "week") return "date"; // still 'date', ama gösterim mantığı haftaya göre
      return "month";
    };

    const handleDateChange = (date: unknown) => {
      if (dayjs.isDayjs(date)) {
        if (view === "week") {
          const startOfWeek = date.startOf("week"); // haftanın ilk günü
          onNavigate("DATE", startOfWeek.toDate());
        } else if (view === "day") {
          onNavigate("DATE", date.toDate());
        } else {
          const startOfMonth = date.startOf("month");
          onNavigate("DATE", startOfMonth.toDate());
        }
      } else {
        console.warn("Invalid date format received", date);
      }
    };

    const getDateFormat = (date: dayjs.Dayjs) => {
      if (view === "week") {
        const start = date.startOf("week"); // Pazartesi
        const end = date.endOf("week"); // Pazar
        return `${start.format("DD MMM")} - ${end.format("DD MMM YYYY")}`;
      }
      if (view === "day") return date.format("DD MMMM YYYY");
      return date.format("MMMM YYYY");
    };

    return (
      <ToolbarContainer>
        {isMobile ? (
          <MobileRow>
            <div>
              <ConfigProvider locale={currentLocale}>
                <StyledDatePicker
                  picker={getPickerType()}
                  value={dayjs(date)}
                  onChange={handleDateChange}
                  suffixIcon={null}
                  format={getDateFormat}
                  style={{ width: "100%" }}
                />
              </ConfigProvider>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {hasRole(["ADMIN", "COMPANY_ADMIN"]) && (
                <CompanyDropdown
                  selectedItem={company}
                  onSelect={(selectedCompany) => setCompany(selectedCompany)}
                />
              )}
              {hasRole(["BRANCH_ADMIN"]) && (
                <AddButton onClick={() => handleModalToggle(true)} />
              )}
            </div>
          </MobileRow>
        ) : (
          <>
            {/* original full layout for desktop */}
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
                  picker={getPickerType()}
                  value={dayjs(date)}
                  onChange={handleDateChange}
                  suffixIcon={null}
                  format={getDateFormat}
                  style={{ width: "100%" }}
                />
              </ConfigProvider>
            </NavButtons>

            <NavButtons>
              {hasRole(["ADMIN", "COMPANY_ADMIN"]) && (
                <CompanyDropdown
                  selectedItem={company}
                  onSelect={(selectedCompany) => setCompany(selectedCompany)}
                />
              )}
              <Dropdown menu={{ items }} trigger={["click"]}>
                <ToggleViewButton
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  {viewOptions.find((v) => v.key === view)?.icon}
                  {viewOptions.find((v) => v.key === view)?.label}
                </ToggleViewButton>
              </Dropdown>
              {hasRole(["COMPANY_ADMIN", "BRANCH_ADMIN"]) && (
                <AddButton onClick={() => handleModalToggle(true)} />
              )}
            </NavButtons>
          </>
        )}
      </ToolbarContainer>
    );
  }
);

Toolbar.displayName = "Toolbar";

export default Toolbar;
