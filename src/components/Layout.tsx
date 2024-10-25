// Layout.tsx
import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import Sidebar from "./Sider";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import styled from "styled-components";

const { Content } = Layout;

const StyledContent = styled(Content)<{ isMobile: any }>`
  background: ${({ isMobile }) => (isMobile ? "#f0f2f5" : "#f6f5ff")};
  padding: ${({ isMobile }) => (isMobile ? "10px" : "20px")};
  border-radius: ${({ isMobile }) => (isMobile ? "0" : "30px")};
  margin: ${({ isMobile }) => (isMobile ? "0" : "0 20px 20px 20px")};
  display: flex;
  flex-direction: column;
`;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobile(mobileView);
      setCollapsed(mobileView); // Sync collapsed state for mobile view.
    };

    window.addEventListener("resize", handleResize);

    // Ensure layout adjusts correctly on first load.
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  const closeSider = () => {
    setCollapsed(true);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {!collapsed && isMobile && (
        <div
          onClick={closeSider}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 99,
          }}
        />
      )}
      <Sidebar
        collapsed={collapsed}
        isMobile={isMobile}
        closeSider={closeSider}
        setCollapsed={setCollapsed}
      />
      <Layout className="site-layout">
        {isMobile && (
          <Header collapsed={collapsed} setCollapsed={toggleSider} />
        )}
        <StyledContent isMobile={isMobile} style={{}}>
          <Outlet />
        </StyledContent>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
