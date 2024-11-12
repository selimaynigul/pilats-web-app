// ToolbarStyles.ts

import styled from "styled-components";

export const ToolbarContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.bodyBg};
  border-radius: 50px;
  padding: 10px;
`;

export const NavButtons = styled.div`
  display: flex;
  gap: 5px;
`;

export const TitleButton = styled.button`
  margin: 0;
  height: 35px;
  padding: 5px 15px;
  color: #4d3abd;
  cursor: pointer;
  background: transparent;
  display: flex;
  align-items: center;
  font-size: 16px;
  border-radius: 50px;
  border: none;
  transition: background 0.2s;

  &:hover {
    background: #f6f5ff;
  }
`;

export const CompanyDropdownButton = styled.button`
  position: relative;
  margin: 0;
  border: none;
  height: 35px;
  padding: 5px 15px;
  color: #4d3abd;
  cursor: pointer;
  background: transparent;
  display: flex;
  align-items: center;
  font-weight: bold;
  border: 1px solid #4d3abd;
  border-radius: 50px;
  transition: padding-right 0.3s ease;

  &:hover {
    padding-right: 35px;
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  right: 15px;
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(10px);
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;

  ${CompanyDropdownButton}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const ActionButton = styled.button`
  border: 1px solid transparent;
  background: ${({ theme }) => theme.contentBg};
  color: #4d3abd;
  border-radius: 50px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  cursor: pointer;
  transition: border 0.2s;

  &:hover {
    border: 1px solid #4d3abd;
  }
`;

export const AddButton = styled(ActionButton)`
  border: none;
  color: white;
  transition: 0.2s;

  background: ${({ theme }) => theme.primary};
  &:hover {
    border: none;
    transform: scale(1.1);
  }
  &:active {
    border: none;
    transform: scale(0.9);
  }
`;

export const ToggleViewButton = styled(ActionButton)`
  width: fit-content;
  padding: 5px 15px;
`;
