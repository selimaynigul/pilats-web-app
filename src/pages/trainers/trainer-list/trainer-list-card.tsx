import React from "react";
import styled, { useTheme } from "styled-components";
import { Card, Avatar } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EllipsisOutlined,
  UserOutlined,
  ArrowRightOutlined,
  PhoneFilled,
} from "@ant-design/icons";

import { BsEnvelopeFill, BsWhatsapp } from "react-icons/bs";
import { Link } from "react-router-dom";
import { capitalize } from "utils/permissionUtils";

const { Meta } = Card;

const StyledCard = styled(Card)`
  border-radius: 20px;
  .ant-card-body {
    padding: 10px;
  }
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.2);
  }

  /* .ant-card-body {
    display: none;
  } */

  .ant-card-meta-title {
    margin-bottom: 0 !important;
  }
`;

const Container = styled.div`
  background: ${({ theme }) => theme.contentBg};
  padding: 12px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
`;

const ContactInfo = styled.div`
  color: #4a4a4a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 32px;
`;
const ContactButton = styled.div`
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

const CompanyInfo = styled.div`
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

const CompanyLogo = styled.div`
  background: #e6e3ff;
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
    color: black;
  }
  small {
    color: gray;
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
  /* color: #5d46e5; */
  color: gray;
`;

const InactiveIcon = styled.div`
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

  &:before {
    content: "";
    background: white;
    width: 4px;
    height: 1px;
    border-radius: 10px;
  }
`;

const TrainerCard: React.FC<{ trainer: any }> = ({ trainer }) => {
  const whatsappLink = `https://wa.me/+905077845678`;
  console.log(trainer);
  return (
    <StyledCard
      cover={
        <Link to={`/trainers/${trainer.id}`}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: 16,
              paddingBottom: 0,
              gap: 12,
            }}
          >
            {!trainer.active && <InactiveIcon title="Not working" />}
            <Avatar
              size={60}
              src={"http://193.140.134.43/tomcat/platesapi/api/v1/images/" + trainer.imageUrl}
              style={{ background: "lightgrey", flexShrink: 0 }}
            >
              {trainer.ucGetResponse.name[0].toUpperCase()}
            </Avatar>
            <Meta
              title={capitalize(
                `${trainer.ucGetResponse.name} ${trainer.ucGetResponse.surname}`
              )}
              description={trainer.jobName}
            />
          </div>
        </Link>
      }
    >
      <Container>
        <Link to={`/companies/${trainer.companyId}`}>
          <CompanyInfo>
            <CompanyLogo>
              <UserOutlined style={{ fontSize: 20 }} />
            </CompanyLogo>
            <CompanyName>
              <strong>{trainer.companyName}</strong>
              <small>{trainer.branchName}</small>
            </CompanyName>
            <CompanyDetailButton>
              <ArrowRightOutlined />
            </CompanyDetailButton>
          </CompanyInfo>
        </Link>
        <ContactInfo>
          <Link
            to={`mailto:${trainer.ucGetResponse.name}`}
            style={{ color: "#4a4a4a" }}
          >
            <ContactButton>
              <BsEnvelopeFill />
            </ContactButton>
          </Link>
          <Link
            to={`mailto:${trainer.ucGetResponse.name}`}
            style={{ color: "#4a4a4a" }}
          >
            <ContactButton>
              <PhoneFilled />
            </ContactButton>
          </Link>

          <Link
            to={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4a4a4a" }}
          >
            <ContactButton>
              <BsWhatsapp />
            </ContactButton>
          </Link>
        </ContactInfo>
      </Container>
    </StyledCard>
  );
};

export default TrainerCard;
