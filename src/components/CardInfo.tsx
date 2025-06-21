import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightOutlined, UserOutlined } from "@ant-design/icons";
import styled from "styled-components";

interface CardInfoProps {
  id?: string | number;
  title: string | null;
  detail?: string | null;
  to?: string; // opsiyonel: varsa Link, yoksa div
  imageUrl?: string | null; // opsiyonel: varsa logo, yoksa varsayılan ikon
  companyImageUrl?: string | null; // opsiyonel: varsa şirket logosu, yoksa varsayılan ikon
  onClick?: () => void; // opsiyonel: custom tıklama
}

const CompanyInfo = styled.div`
  /*   border: 1px solid white;
 */
  width: 100%;
  border-radius: 10px;
  padding: 5px;
  display: flex;
  background: white;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s;
  background: ${({ theme }) => theme.cardBg};

  &:hover {
    div:nth-of-type(3) {
      opacity: 1;
    }

    box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.2);
  }
`;

const CompanyLogo = styled.div`
  background: ${({ theme }) => theme.avatarBg};
  height: 40px;
  width: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const CompanyName = styled.div`
  display: flex;
  flex-direction: column;
  strong {
    color: ${({ theme }) => theme.text};
  }
  small {
    color: ${({ theme }) => theme.text}70;
  }
`;

const CompanyDetailButton = styled.div`
  background: transparent;
  height: 30px;
  width: 30px;
  border-radius: 10px;
  opacity: 0;
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
  color: gray;
`;

const CardInfo: React.FC<CardInfoProps> = ({
  id,
  title,
  detail,
  to,
  imageUrl,
  companyImageUrl,
  onClick,
}) => {
  const content = (
    <CompanyInfo onClick={onClick}>
      {
        companyImageUrl ?
        <img 
      src={`https://uat-platesapi-latest.onrender.com/api/v1/images/${companyImageUrl}`} 
      alt="Company Logo"
      style={{ width: 30, height: 30, objectFit: 'contain' }} 
    />
          :
        <CompanyLogo>
        <UserOutlined style={{ fontSize: 20 }} />
      </CompanyLogo>
      }
      
      <CompanyName>
        <strong>{title || "Unnamed Company"}</strong>
        {detail && <small>{detail}</small>}
      </CompanyName>
      <CompanyDetailButton>
        <ArrowRightOutlined />
      </CompanyDetailButton>
    </CompanyInfo>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};

export default CardInfo;
