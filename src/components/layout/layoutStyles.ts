// styles.ts
import styled, { css } from "styled-components";
import { Avatar, Input, Layout } from "antd";

// Theme for consistent color usage
export const theme = {
  primaryColor: "#5d46e5",
  secondaryColor: "#f6f5ff",
  backgroundColor: "#f0f2f5",
  borderColor: "#e6e3ff",
  hoverBackgroundColor: "#f6f5ff",
  blurBackgroundColor: "rgba(255, 255, 255, 0.5)",
};

const { Content } = Layout;

export const StyledContent = styled(Content)<{
  isSessionsPage: boolean;
  isMobile: boolean;
}>`
  background: ${({ theme }) => theme.contentBg};
  padding: ${({ isMobile, isSessionsPage }) =>
    isMobile ? (isSessionsPage ? "10px 0px 0px 0px" : "10px") : "20px"};
  border-radius: ${({ isMobile }) => (isMobile ? "0" : "30px")};
  margin: ${({ isMobile }) => (isMobile ? "0" : "16px 16px 16px 0")};
  display: flex;
  flex-direction: column;
  height: 100dvh;
  /*   overflow-Y: hidden; */

  &::-webkit-scrollbar-track {
    margin: 24px 0;
  }
`;

export const Heading = styled.div<{ isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ isMobile }) => (isMobile ? "0 10px" : "0 36px")};
  margin-top: ${({ isMobile }) => (isMobile ? "0" : "16px")};
`;

export const Title = styled.h2`
  color: ${theme.primaryColor};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchContainer = styled.div<{
  isMobile: boolean;
  searchActive: boolean;
}>`
  position: relative;
  width: 500px;
  margin: ${({ isMobile }) => (isMobile ? "16px 0" : "0")};
  display: ${({ searchActive }) => (searchActive ? "flex" : "none")};
`;

export const Search = styled(Input)<{ focused: boolean }>`
  border-radius: 50px;
  width: 100%;
  height: 48px;
  padding-right: ${({ focused }) => (focused ? "50px" : "20px")};
  border: none;
  background: ${({ theme }) => theme.contentBg} !important;
  padding-left: 20px;

  &::placeholder {
    color: #c9c2f0;
    padding-left: 10px;
  }

  &:focus {
    outline: none;
    padding-right: 50px;
  }
`;

export const SearchIcon = styled.div<{ visible: boolean }>`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${theme.primaryColor};
  color: white;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;

  h4 {
    margin: 0;
    color: ${theme.primaryColor};
  }

  span {
    font-size: 12px;
    color: #888;
  }
`;

export const StyledAvatar = styled(Avatar)`
  width: 48px;
  height: 48px;
  border-radius: 20px;
  background-size: cover;
  font-size: 18px;
  cursor: pointer;
  background-color: #e6e3ff;
`;

export const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;

  &:hover {
    background: ${theme.hoverBackgroundColor};
  }
`;

export const DropdownOverlay = styled.div`
  border-radius: 20px;
  padding: 6px;
  background-color: ${theme.blurBackgroundColor};
  backdrop-filter: blur(8px);
  border: 1px solid white;
`;

export const TransparentMenu = styled.div`
  display: flex;
  justify-content: start;
  padding: 6px 6px;
  padding-bottom: 10px;
  box-shadow: none;
  gap: 5px;
  border-bottom: 1px solid #f0f0f0;
`;

export const CategoryItem = styled.div<{ isSelected: boolean }>`
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 50px;
  font-weight: bold;
  color: ${({ isSelected }) => (isSelected ? theme.primaryColor : "inherit")};
  background: ${({ isSelected }) =>
    isSelected ? theme.secondaryColor : "transparent"};

  &:hover {
    background: rgba(238, 237, 251, 0.57);
  }
`;
