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
  blurBackgroundColor: "rgba(255, 255, 255, 0.7)",
};

const { Content } = Layout;

export const StyledContent = styled(Content).withConfig({
  shouldForwardProp: (prop) => !["isSessionsPage", "isMobile"].includes(prop),
})<{
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

export const Heading = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isMobile",
})<{ isMobile: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ isMobile }) => (isMobile ? "0 10px" : "0 36px")};
  margin-top: ${({ isMobile }) => (isMobile ? "0" : "16px")};
  gap: 10px;
  z-index: 0;

  &.search-active {
    animation: slideDownHeading 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideDownHeading {
    from {
      transform: translateY(-40px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.title};

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SearchContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !["isMobile", "searchActive"].includes(prop),
})<{
  isMobile: boolean;
  searchActive: boolean;
}>`
  position: relative;
  width: 500px;
  margin: ${({ isMobile }) => (isMobile ? "16px 0" : "0")};
  display: ${({ searchActive }) => (searchActive ? "flex" : "none")};
  z-index: 99;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Search = styled(Input).withConfig({
  shouldForwardProp: (prop) => prop !== "focused",
})<{ focused: boolean }>`
  border-radius: 50px;
  width: 100%;
  height: 48px;
  padding-right: ${({ focused }) => (focused ? "50px" : "20px")};
  border: none;
  background: ${({ theme }) => theme.contentBg} !important;
  padding-left: 20px;
  border: 2px solid transparent;
  z-index: 99;

  color: ${({ theme }) => theme.text};

  &:hover {
    border: 2px solid ${({ theme }) => theme.primary}10;
  }

  &::placeholder {
    color: ${({ theme }) => theme.placeholder};
  }

  &:focus {
    outline: none;
    padding-right: 50px;
    border: 2px solid transparent;
  }
`;

export const ShortcutHint = styled.span`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: #f0edff;
  border: 1px solid #c9c2f0;
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 12px;
  color: rgba(94, 70, 229, 0.8);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
`;

export const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  z-index: 99;

  &:hover ${ShortcutHint} {
    opacity: 1;
  }
`;

export const ResultContainer = styled.div`
  max-height: 300px;
  overflow-y: auto;
  background: ${({ theme }) => theme.contentBg};
  border-radius: 14px;

  /* Scrollbar styles */
  &::-webkit-scrollbar {
    width: 6px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.bodyBg};
    border-radius: 6px;
    border: none;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 10px 0;
  }

  @media (max-width: 768px) {
    max-height: 70dvh;
  }
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
  background-color: ${({ theme }) => theme.profileAvatarBg};
`;

export const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 16px;
  cursor: pointer;
  margin: 5px;
  border-radius: 9px;
  transition: 0.1s;
  color: ${({ theme }) => theme.text};

  &:hover {
    background: ${({ theme }) => theme.bodyBg} !important;
  }

  small {
    color: ${({ theme }) => theme.text}90;
  }
`;

export const DropdownOverlay = styled.div`
  border-radius: 20px;
  padding: 6px;
  background-color: ${({ theme }) => theme.cardBg};
  box-shadow: rgba(0, 0, 0, 0.1) 0px 8px 12px !important;
`;

export const TransparentMenu = styled.div`
  display: flex;
  justify-content: start;
  padding: 6px;
  box-shadow: none;
  gap: 5px;
`;

export const CategoryItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected: boolean }>`
  cursor: pointer;
  padding: 2px 10px;
  border-radius: 50px;
  font-weight: bold;
  color: ${({ isSelected, theme }) => (isSelected ? theme.title : theme.text)};
  background: ${({ isSelected, theme }) =>
    isSelected ? theme.contentBg : "transparent"};

  &:hover {
    background: ${({ theme }) => theme.contentBg};
  }
`;
