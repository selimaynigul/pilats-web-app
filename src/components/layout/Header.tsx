import React from "react";
import { Layout, Dropdown, Menu } from "antd";
import styled from "styled-components";
import { AiOutlineMenu } from "react-icons/ai";
import {
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const StyledHeader = styled(Header)`
  padding: 5px 10px;
  justify-content: space-between;
  border-bottom: 1px solid #e6e3ff;
  background-color: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(8px) !important;
  display: flex;
  align-items: center;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #e6e3ff;
  color: #4d3abd;
  border: none;
  border-radius: 15px;
  cursor: pointer;
`;

const ProfilePhoto = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 15px;
  background-image: url("profile.jpg");
  background-size: cover;
  cursor: pointer;
  margin-left: 8px;
`;

const SearchIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #5d46e5;
  color: #5d46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const Title = styled.h2`
  color: #5d46e5;
`;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setSearchActive: (active: boolean) => void;
  searchActive: boolean;
  isMobile: boolean;
  pageTitle: string;
}

const AppHeader: React.FC<HeaderProps> = ({
  collapsed,
  setCollapsed,
  isMobile,
  searchActive,
  setSearchActive,
  pageTitle,
}) => {
  const profileMenu = (
    <Menu>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        Settings
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined style={{ color: "red" }} />}
        style={{ color: "red" }}
      >
        Log Out
      </Menu.Item>
    </Menu>
  );

  const toggleSearch = () => setSearchActive(!searchActive);

  return (
    <StyledHeader>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <MenuButton onClick={() => setCollapsed(!collapsed)}>
          <AiOutlineMenu />
        </MenuButton>
        <Title>{pageTitle}</Title>
      </div>
      {isMobile && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <SearchIcon onClick={toggleSearch}>
            {searchActive ? <CloseOutlined /> : <SearchOutlined />}
          </SearchIcon>
          <Dropdown
            overlay={profileMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
            <ProfilePhoto />
          </Dropdown>
        </div>
      )}
    </StyledHeader>
  );
};

export default AppHeader;
