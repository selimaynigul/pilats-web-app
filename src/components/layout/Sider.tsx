import React, { useEffect, useState } from "react";
import { Layout, Menu, Switch, Select } from "antd";
import {
  CaretRightOutlined,
  CaretLeftOutlined,
  MoonFilled,
  SunFilled,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BsFillHouseDoorFill,
  BsFillCalendarRangeFill,
  BsFillPeopleFill,
  BsFillPersonFill,
  BsCreditCard2FrontFill,
  BsBarChartFill,
} from "react-icons/bs";
import styled from "styled-components";
import { getCompanyId, hasRole } from "utils/permissionUtils";
import { useLanguage } from "hooks";
import { useTheme } from "contexts/ThemeProvider";

const { Sider } = Layout;
const { Option } = Select;

const StyledSider = styled(Sider).withConfig({
  shouldForwardProp: (prop) => prop !== "isMobile",
})<{ isMobile: boolean }>`
  background: ${({ theme }) => theme.bodyBg};
  padding: ${({ isMobile }) => (isMobile ? "0" : "10px 0 0")};
  height: ${({ isMobile }) => (isMobile ? "100vh" : "auto")};
  position: ${({ isMobile }) => (isMobile ? "fixed" : "sticky")};
  top: 0;
  left: 0;
  margin: 0 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 1024px) {
    margin: 0;
  }
`;

const LogoContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !["collapsed", "isMobile"].includes(prop),
})<{ collapsed: boolean; isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ collapsed }) => (collapsed ? "center" : "flex-start")};
  padding: ${({ collapsed }) => (collapsed ? "10px 0" : "10px 20px")};
  margin-bottom: 20px;
  background: ${({ theme }) => theme.bodyBg};

  .logo-icon {
    width: ${({ collapsed, isMobile }) =>
      collapsed || isMobile ? "30px" : "30px"};
    transition: width 0.3s ease;
  }

  .logo-text {
    display: ${({ collapsed, isMobile }) =>
      collapsed || isMobile ? "none" : "inline"};
    margin-left: 10px;
    width: 90px;
    transition: opacity 0.3s ease;
  }
`;
const CustomTrigger = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "collapsed",
})<{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  left: 10px;
  border-radius: 10px;
  background: ${({ theme }) => theme.triggerBg};
  color: ${({ theme }) => theme.title};
`;

const BottomSwitch = styled(Switch)`
  position: absolute;
  bottom: 85px;
  left: 10px;
  background-color: #5d46e5;
`;

const LanguageSelector = styled(Select)`
  position: absolute;
  bottom: 120px;
  left: 5px;
  background: ${({ theme }) => theme.bodyBg};

  .ant-select-selector {
    border: none !important;
    background: ${({ theme }) => theme.bodyBg} !important;
  }

  .ant-select-selection-item, .ant-select-arrow {
    color:  ${({ theme }) => theme.menuItemText}; !important;
  }
`;

interface SiderProps {
  collapsed: boolean;
  isMobile: boolean;
  closeSider: any;
  setCollapsed: any;
}

const Sidebar: React.FC<SiderProps> = ({
  collapsed,
  isMobile,
  closeSider,
  setCollapsed,
}) => {
  const [selectedKey, setSelectedKey] = useState("1");
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    localStorage.getItem("rcml-lang") || "en"
  );
  const { userLanguage, userLanguageChange, t } = useLanguage();

  const navigate = useNavigate();

  const loc = useLocation();
  const { toggleTheme, getTheme } = useTheme();

  // Update selected key based on URL path
  useEffect(() => {
    const pathToKey: { [key: string]: string } = {
      "/companies": "companies",
      "/sessions": "sessions",
      "/trainers": "trainers",
      "/users": "users",
      "/packages": "packages",
      "/reports": "reports",
    };

    const matchedEntry = Object.entries(pathToKey).find(([path]) =>
      loc.pathname.includes(path)
    );

    const currentKey = matchedEntry ? matchedEntry[1] : "a"; // TODO: fix this "a"
    setSelectedKey(currentKey);
  }, [loc.pathname]);

  const handleMenuSelect = ({ key }: { key: string }) => {
    setSelectedKey(key);
    const routes: { [key: string]: string } = {
      companies: "/companies",
      sessions: "/sessions",
      trainers: "/trainers",
      users: "/users",
      packages: "/packages",
      reports: "/reports",
    };

    if (isMobile) {
      closeSider();
    }

    if (hasRole(["COMPANY_ADMIN", "BRANCH_ADMIN"]) && key === "companies") {
      navigate(`/companies/${getCompanyId()}`);
    } else {
      navigate(routes[key]);
    }
  };

  const menuItems = [
    {
      key: "companies",
      icon: <BsFillHouseDoorFill />,
      label: hasRole(["ADMIN"]) ? t.companies : t.myCompany,
    },
    { key: "sessions", icon: <BsFillCalendarRangeFill />, label: t.sessions },
    { key: "trainers", icon: <BsFillPeopleFill />, label: t.trainers },
    { key: "users", icon: <BsFillPersonFill />, label: t.users },
    { key: "packages", icon: <BsCreditCard2FrontFill />, label: t.packages },
    { key: "reports", icon: <BsBarChartFill />, label: t.reports },
  ];

  return (
    <StyledSider
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={isMobile ? 0 : 60}
      width={isMobile ? "240px" : "200px"}
      isMobile={isMobile}
    >
      <LogoContainer collapsed={collapsed} isMobile={isMobile}>
        <img className="logo-icon" src="/logo-icon.svg" alt="Logo Icon" />
        <img
          className="logo-text"
          src={
            getTheme() === "light" ? "/logo-text.svg" : "/logo-text-white.svg"
          }
          alt="Logo Text"
        />
      </LogoContainer>
      <Menu
        defaultSelectedKeys={[window.location.pathname]}
        theme="light"
        style={{
          background: "white",
          border: "none",
          borderRadius: 20,
          padding: "5px",
        }}
        mode="inline"
        onSelect={handleMenuSelect}
        selectedKeys={[selectedKey]}
        items={menuItems}
      />

      {!isMobile && (
        <>
          <LanguageSelector
            value={userLanguage}
            onChange={(value) => userLanguageChange()}
          >
            <Option value="en">EN</Option>
            <Option value="tr">TR</Option>
          </LanguageSelector>

          <BottomSwitch
            checkedChildren={<MoonFilled />}
            unCheckedChildren={<SunFilled />}
            onChange={toggleTheme}
          />

          <CustomTrigger
            collapsed={collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <CaretRightOutlined /> : <CaretLeftOutlined />}
          </CustomTrigger>
        </>
      )}
    </StyledSider>
  );
};

export default Sidebar;
