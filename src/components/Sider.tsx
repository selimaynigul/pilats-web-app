import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { CaretRightOutlined, CaretLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  BsFillHouseDoorFill,
  BsFillCalendarRangeFill,
  BsFillPeopleFill,
  BsFillPersonFill,
  BsCreditCard2FrontFill,
  BsBarChartFill,
} from "react-icons/bs";

const { Sider } = Layout;

const CustomTrigger: React.FC<{ collapsed: boolean; onClick: () => void }> = ({
  collapsed,
  onClick,
}) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      cursor: "pointer",
      position: "absolute",
      bottom: "10px",
      left: "20px",
      borderRadius: 10,
      background: "#e9e6ff",
      color: "black",
    }}
  >
    {collapsed ? <CaretRightOutlined /> : <CaretLeftOutlined />}
  </div>
);

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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const navigate = useNavigate(); // For navigation

  const handleMouseEnter = () => {
    if (collapsed) setCollapsed(false);
  };

  const handleMouseLeave = () => {
    if (!isOpen) setCollapsed(true);
  };

  const handleMenuSelect = ({ key }: { key: string }) => {
    setSelectedKey(key);
    console.log(selectedKey);
    const routes: { [key: string]: string } = {
      companies: "/companies",
      classes: "/classes",
      traniers: "/trainers",
      users: "/users",
      packages: "/packages",
      reports: "/reports",
    };

    if (isMobile) {
      closeSider();
    }
    navigate(routes[key]);
  };

  const menuItems = [
    { key: "companies", icon: <BsFillHouseDoorFill />, label: "Şirketim" },
    { key: "classes", icon: <BsFillCalendarRangeFill />, label: "Dersler" },
    { key: "traniers", icon: <BsFillPeopleFill />, label: "Eğitmenler" },
    { key: "users", icon: <BsFillPersonFill />, label: "Kullanıcılar" },
    { key: "packages", icon: <BsCreditCard2FrontFill />, label: "Paketler" },
    { key: "reports", icon: <BsBarChartFill />, label: "Raporlar" },
  ];

  /*   console.log(window.location.pathname); */
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={isMobile ? 0 : 60}
      width={isMobile ? 260 : undefined}
      style={{
        background: "white",
        margin: "20px 10px 10px 10px",
        borderRadius: 15,
        height: isMobile ? "100vh" : "null",
        position: isMobile ? "fixed" : "sticky",
        top: 0,
        left: 0,
        zIndex: "100",
      }}
    >
      <Menu
        defaultSelectedKeys={[window.location.pathname]}
        onMouseEnter={!isMobile ? handleMouseEnter : () => {}}
        onMouseLeave={!isMobile ? handleMouseLeave : () => {}}
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
      <CustomTrigger
        collapsed={collapsed}
        onClick={() => setCollapsed(!collapsed)}
      />
    </Sider>
  );
};

export default Sidebar;
