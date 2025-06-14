import styled from "styled-components";

export const ToolbarContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MobileDateContainer = styled.div`
  @media (max-width: 768px) {
    display: block;
    width: 100%;
  }
`;
export const MobileActionContainer = styled.div`
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    background: white;
    border-radius: 50px;
    padding: 5px;
    display: flex;
    align-items: center;
    margin: 0 10px;
  }
`;

export const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background: red;
  padding: 10px;
  height: 50px;
  border-radius: 50px;
  background: ${({ theme }) => theme.bodyBg};
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

export const ActionButton = styled.button`
  border: 1px solid transparent;
  background: ${({ theme }) => theme.contentBg};
  color: ${({ theme }) => theme.calendarHeaderText};
  border-radius: 50px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  cursor: pointer;
  transition: border 0.2s;
  flex-shrink: 0;

  &:hover {
    border: 1px solid #4d3abd;
  }
`;

export const ToggleViewButton = styled(ActionButton)`
  width: fit-content;
  padding: 5px 15px;
`;
