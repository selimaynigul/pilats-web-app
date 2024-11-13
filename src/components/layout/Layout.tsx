import React, { useEffect, useState } from "react";
import { Layout, Dropdown, Avatar, Menu } from "antd";
import Sidebar from "../Sider";
import Header from "../Header";
import { Outlet, useLocation } from "react-router-dom";
import {
  StyledContent,
  Heading,
  Title,
  SearchContainer,
  Search,
  SearchIcon,
  ProfileContainer,
  ProfileInfo,
  ProfilePhoto,
  ResultItem,
  DropdownOverlay,
  TransparentMenu,
  CategoryItem,
} from "./layoutStyles";
import {
  SearchOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "contexts/AuthProvider";

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("company");
  const [searchActive, setSearchActive] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobile(mobileView);
      setCollapsed(mobileView);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { logout } = useAuth();

  const handleLogout = () => {
    console.log("loogout");
    logout();
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item
        onClick={handleLogout}
        key="logout"
        icon={<LogoutOutlined style={{ color: "red" }} />}
        style={{ color: "red" }}
      >
        Log Out
      </Menu.Item>
    </Menu>
  );

  // Define titles based on paths
  const pathTitles: { [key: string]: string } = {
    "/": "Dashboard",
    "/companies": "Companies",
    "/classes": "Classes",
    "/trainers": "Trainers",
    "/users": "Users",
    "/packages": "Packages",
    "/reports": "Reports",
    // Add more paths and titles as needed
  };

  // Get title based on the current path
  const pageTitle = pathTitles[location.pathname] || "Dashboard";

  const mockResults = {
    company: [
      { name: "Tech Corp", location: "New York, NY" },
      { name: "Innovate Ltd.", location: "San Francisco, CA" },
    ],
    trainer: [
      {
        name: "Alice Johnson",
        job: "Yoga Instructor",
        company: "FitLife",
        photo: "profile1.jpg",
      },
      {
        name: "Bob Smith",
        job: "Fitness Trainer",
        company: "HealthyHub",
        photo: "profile2.jpg",
      },
    ],
    user: [
      { name: "Charlie Brown", photo: "profile3.jpg" },
      { name: "Lucy Williams", photo: "profile4.jpg" },
    ],
  };

  const renderResults = () => {
    if (selectedCategory === "company") {
      return mockResults.company.map((company) => (
        <ResultItem key={company.name}>
          <div>
            <strong>{company.name}</strong>
            <br />
            <span>{company.location}</span>
          </div>
        </ResultItem>
      ));
    } else if (selectedCategory === "trainer") {
      return mockResults.trainer.map((trainer) => (
        <ResultItem key={trainer.name}>
          <Avatar src={trainer.photo} />
          <div>
            <strong>{trainer.name}</strong>
            <br />
            <span>
              {trainer.job} - {trainer.company}
            </span>
          </div>
        </ResultItem>
      ));
    } else {
      return mockResults.user.map((user) => (
        <ResultItem key={user.name}>
          <Avatar src={user.photo} />
          <div>
            <strong>{user.name}</strong>
          </div>
        </ResultItem>
      ));
    }
  };

  const dropdownOverlay = (
    <DropdownOverlay>
      <TransparentMenu>
        <CategoryItem
          isSelected={selectedCategory === "company"}
          onClick={() => setSelectedCategory("company")}
        >
          Company
        </CategoryItem>
        <CategoryItem
          isSelected={selectedCategory === "trainer"}
          onClick={() => setSelectedCategory("trainer")}
        >
          Trainer
        </CategoryItem>
        <CategoryItem
          isSelected={selectedCategory === "user"}
          onClick={() => setSelectedCategory("user")}
        >
          User
        </CategoryItem>
      </TransparentMenu>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {renderResults()}
      </div>
    </DropdownOverlay>
  );

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
        <Heading isMobile={isMobile}>
          <Title>{pageTitle}</Title>

          <Dropdown
            overlay={dropdownOverlay}
            trigger={["click"]}
            placement="bottomCenter"
          >
            <SearchContainer
              isMobile={isMobile}
              searchActive={isMobile ? searchActive : true}
            >
              <Search
                placeholder="Search something"
                focused={searchFocused}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {/*   <SearchIcon visible={searchFocused}>
                <SearchOutlined />
              </SearchIcon> */}
            </SearchContainer>
          </Dropdown>
          {!isMobile && (
            <ProfileContainer>
              <ProfileInfo>
                <h4>John Doe</h4>
                <span>Software Engineer</span>
              </ProfileInfo>
              <Dropdown
                overlay={profileMenu}
                trigger={["click"]}
                placement="bottomRight"
              >
                <ProfilePhoto />
              </Dropdown>
            </ProfileContainer>
          )}
        </Heading>
        <StyledContent isMobile={isMobile}>
          <Outlet />
        </StyledContent>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
