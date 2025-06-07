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
import { useLanguage } from "hooks";
import { StyledAvatar } from "./layoutStyles";
import { getUserName, hasRole } from "utils/permissionUtils";
import { useAuth } from "contexts/AuthProvider";
import { useLocation, useNavigate } from "react-router-dom";

const { Header } = Layout;

const StyledHeader = styled(Header)`
  padding: 5px 10px;
  justify-content: space-between;
  border-bottom: 1px solid #e6e3ff;
  background-color: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(8px) !important;
  display: flex;
  align-items: center;
  z-index: 2;
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
const SearchIcon = styled.div<{ $visible?: boolean }>`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #5d46e5;
  display: ${({ $visible }) => ($visible === false ? "none" : "flex")};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5d46e5;
  margin-right: 8px;

  .magic-icon-search {
    display: inline-block;
    position: fixed;
    width: 16px;
    height: 16px;
    cursor: pointer;
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
  }
  .magic-icon-search::before {
    color: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
    content: "";
    display: inline-block;
    width: 10%;
    height: 40%;
    background: ${({ theme }) => theme.primary};
    position: absolute;
    left: 75%;
    top: 75%;
    transform: translate(-50%, -50%) rotate(-45deg);
    transition: all 0.3s;
  }
  .magic-icon-search::after {
    content: "";
    display: inline-block;
    position: absolute;
    width: 50%;
    height: 50%;
    border: 2px solid ${({ theme }) => theme.primary};
    border-radius: 50%;
    top: 40%;
    left: 40%;
    transform: translate(-50%, -50%) rotate(0deg);
    transition: all 0.3s;
  }
  .magic-icon-search.close::before {
    background: ${({ theme }) => theme.primary};
    height: 80%;
    left: 50%;
    top: 50%;
  }
  .magic-icon-search.close::after {
    border-width: 1px;
    border-radius: 0;
    background: ${({ theme }) => theme.primary};
    width: 0;
    height: 70%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    transition:
      all 0.3s,
      background 0s 0.3s;
  }
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
  const { t } = useLanguage();
  const getUserInitial = () => {
    const name = getUserName() || "U";
    return name.charAt(0).toUpperCase();
  };

  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout(location);
  };

  const profileMenu = (
    <Menu>
      {hasRole(["ADMIN", "COMPANY_ADMIN"]) && (
        <Menu.Item
          onClick={() => navigate("/role-management")}
          key="settings"
          icon={<SettingOutlined />}
        >
          {t.roleManagement}
        </Menu.Item>
      )}
      <Menu.Item
        onClick={handleLogout}
        key="logout"
        icon={<LogoutOutlined style={{ color: "red" }} />}
        style={{ color: "red" }}
      >
        {t.logout}
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
            {/*             {searchActive ? <CloseOutlined /> : <SearchOutlined />}
             */}{" "}
            <span
              className={`magic-icon-search${searchActive ? " close" : ""}`}
            ></span>
          </SearchIcon>
          <Dropdown
            overlay={profileMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
            <StyledAvatar>{getUserInitial()}</StyledAvatar>
          </Dropdown>
        </div>
      )}
    </StyledHeader>
  );
};

export default AppHeader;
