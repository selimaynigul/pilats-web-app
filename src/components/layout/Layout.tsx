import React, { useEffect, useState } from "react";
import { Layout, Dropdown } from "antd";
import Sidebar from "./Sider";
import type { MenuProps } from "antd";
import Header from "./Header";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  StyledContent,
  Heading,
  Title,
  ProfileContainer,
  ProfileInfo,
  StyledAvatar,
} from "./layoutStyles";
import { SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "contexts/AuthProvider";
import SearchBar from "./Searchbar";
import { getCompanyName, getUserName, hasRole } from "utils/permissionUtils";
import { useLanguage } from "hooks";

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 1080
  );
  const [searchActive, setSearchActive] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const location = useLocation();

  const getUserInitial = () => {
    const name = getUserName() || "U";
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobileView = width <= 768;
      const tabletView = width > 768 && width <= 1080;
      setIsMobile(mobileView);
      setIsTablet(tabletView);
      setCollapsed(mobileView);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout(location);
  };

  const getUserInfo = (info: string) => {
    if (info === "name") {
      return getUserName();
    }
  };

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const basePath = `${pathSegments[0] || ""}`;
  const pageTitle = t[basePath || "dashboard"];

  const profileMenuItems = [
    ...(hasRole(["ADMIN", "COMPANY_ADMIN"])
      ? [
          {
            key: "settings",
            label: t.roleManagement,
            icon: <SettingOutlined />,
            onClick: () => navigate("/role-management"),
          },
        ]
      : []),
    {
      key: "logout",
      label: <span style={{ color: "red" }}>{t.logout}</span>,
      icon: <LogoutOutlined style={{ color: "red" }} />,
      onClick: handleLogout,
    },
  ];

  const profileDropdownItems: MenuProps["items"] = [
    {
      key: "userInfo",
      label: (
        <div>
          <h4 style={{ marginBottom: 0 }}>{getUserInfo("name")}</h4>
          <span>{getCompanyName()}</span>
        </div>
      ),
    },
    {
      type: "divider" as const,
    },
    ...profileMenuItems,
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || (e.ctrlKey && e.key === "k")) &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        e.preventDefault();
        const event = new CustomEvent("focus-searchbar");
        window.dispatchEvent(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Layout style={{ height: "100vh" }}>
      {!collapsed && isMobile && (
        <div
          onClick={() => setCollapsed(true)}
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
        closeSider={() => setCollapsed(true)}
        setCollapsed={setCollapsed}
      />
      <Layout className="site-layout">
        {isMobile && (
          <Header
            pageTitle={pageTitle}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            isMobile={isMobile}
            searchActive={searchActive}
            setSearchActive={setSearchActive}
          />
        )}
        <Heading
          isMobile={isMobile}
          className={searchActive && isMobile ? "search-active" : ""}
        >
          <Title>{pageTitle}</Title>
          <SearchBar
            isMobile={isMobile}
            searchActive={searchActive}
            setSearchActive={setSearchActive}
          />

          {!isMobile && (
            <ProfileContainer>
              {isTablet ? (
                <Dropdown
                  menu={{ items: profileDropdownItems }}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <StyledAvatar>{getUserInitial()}</StyledAvatar>
                </Dropdown>
              ) : (
                <>
                  <ProfileInfo>
                    <h4 style={{ marginBottom: 3 }}>{getUserInfo("name")}</h4>
                    <span>{getCompanyName()}</span>
                  </ProfileInfo>
                  <Dropdown
                    menu={{ items: profileMenuItems }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <StyledAvatar>{getUserInitial()}</StyledAvatar>
                  </Dropdown>
                </>
              )}
            </ProfileContainer>
          )}
        </Heading>
        <StyledContent
          isSessionsPage={basePath === "sessions"}
          isMobile={isMobile}
        >
          <Outlet />
        </StyledContent>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
