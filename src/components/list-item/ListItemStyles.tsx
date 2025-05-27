import styled from "styled-components";
import { Card } from "antd";

export const StyledCard = styled(Card)`
  border-radius: 20px;
  .ant-card-body {
    padding: 10px;
  }
  cursor: pointer;
  transition: 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.2);
  }

  /* .ant-card-body {
    display: none;
  } */

  .ant-card-meta-title {
    margin-bottom: 0 !important;
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

export const CompanyInfo = styled.div`
  border: 1px solid white;
  /*   box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 12px;
 */
  width: 100%;
  border-radius: 10px;
  margin: 7px 0 15px 0;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  background: #e6e3ff;
  background: white;

  align-items: center;
  transition: all 0.1s ease;

  gap: 10px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    div:nth-of-type(3) {
      opacity: 1;
    }

    box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.2);
  }
`;

export const CompanyLogo = styled.div`
  background: #e6e3ff;
  height: 40px;
  width: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;
export const CompanyName = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    color: black;
  }
  small {
    color: gray;
  }
`;
export const CompanyDetailButton = styled.div`
  background: transparent;
  height: 30px;
  width: 30px;
  border-radius: 10px;
  opacity: 0;
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
  /* color: #5d46e5; */
  color: gray;
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
