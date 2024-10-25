// Header.tsx
import React from "react";
import { Layout } from "antd";
import styled from "styled-components";
import { AiOutlineMenu } from "react-icons/ai";

const { Header } = Layout;

const StyledHeader = styled(Header)`
  padding: 5px 10px;
  justify-content: space-between;
  border-bottom: 1px solid #e6e3ff;
  background-color: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(8px) !important;
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

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AppHeader: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  return (
    <StyledHeader
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <MenuButton onClick={() => setCollapsed(!collapsed)}>
        <AiOutlineMenu />
      </MenuButton>
    </StyledHeader>
  );
};

export default AppHeader;
