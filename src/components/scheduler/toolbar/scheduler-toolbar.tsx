import React, { useEffect, useState } from "react";
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
import { TbLayoutList } from "react-icons/tb";
import { TbLayoutListFilled } from "react-icons/tb";

import { useLanguage } from "hooks";
import enUS from "antd/es/locale/en_US";
import trTR from "antd/es/locale/tr_TR";
import "dayjs/locale/tr";
import "dayjs/locale/en";

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
        {isMobile ? (
          <MobileRow>
            <div>
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
              {viewArray.map((v: any) => {
                const isAgenda = v === "agenda";
                const isActive = view === v;

                return (
                  <ToggleViewButton
                    key={v}
                    onClick={() => onView(v)}
                    style={{
                      fontWeight: isActive ? "bold" : "normal",
                      borderRadius: isAgenda ? "50%" : undefined, // Yuvarlak buton sadece agenda ise
                      width: isAgenda ? 36 : undefined,
                      height: isAgenda ? 36 : undefined,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: isAgenda ? 0 : undefined,
                    }}
                    title={
                      isAgenda ? t["calendar"]?.agenda || "Agenda" : undefined
                    }
                  >
                    {isAgenda ? (
                      isActive ? (
                        <TbLayoutListFilled size={18} />
                      ) : (
                        <TbLayoutList size={18} />
                      )
                    ) : (
                      t["calendar"]?.[v] || capitalize(v)
                    )}
                  </ToggleViewButton>
                );
              })}

              {hasRole(["BRANCH_ADMIN"]) && (
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
