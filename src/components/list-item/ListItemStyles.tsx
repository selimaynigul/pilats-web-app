import styled from "styled-components";
import { Card } from "antd";

export const StyledCard = styled(Card)`
  border-radius: 20px;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid transparent;

  .ant-card-body {
    padding: 10px;
  }
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    transform: translateY(-2px);
    /* box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.2); */
  }

  .ant-card-meta-title {
    margin-bottom: 0 !important;
    color: ${({ theme }) => theme.text};
  }
`;

export const Container = styled.div`
  background: ${({ theme }) => theme.contentBg};
  padding: 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
`;

export const ContactInfo = styled.div`
  color: #4a4a4a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 32px;
  margin-top: 12px;
`;
export const ContactButton = styled.div`
  height: 36px;
  width: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e6e3ff;
  border-color: ${({ theme }) => theme.primary};
  border-radius: 50px;

  svg {
    color: ${({ theme }) => theme.primary};
  }

  font-size: 14px;
`;

export const InactiveIcon = styled.div`
  background: #f54263;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  position: absolute;
  left: 18px;
  top: 14px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid white;
`;
