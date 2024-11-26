import React from "react";
import styled from "styled-components";
import { Card, Avatar } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";

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
`;

const Container = styled.div`
  background: ${({ theme }) => theme.contentBg};
  padding: 10px;
  border-radius: 12px;
  margin-top: 8px;
`;

const InfoSection = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: #7a7a7a;
`;

const ContactInfo = styled.div`
  margin-top: 16px;
  font-size: 14px;
  color: #4a4a4a;
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Trainer {
  name: string;
  title: string;
  department: string;
  hiredDate: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

const TrainerCard: React.FC<{ trainer: any }> = ({ trainer }) => (
  <StyledCard
    cover={
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Avatar
          size={80}
          src={trainer.avatarUrl}
          style={{ margin: "16px 16px 0 16px", borderRadius: "20px" }}
        />
        <Meta
          title={
            trainer.ucGetResponse.name + " " + trainer.ucGetResponse.surname
          }
          description={trainer.title}
        />
      </div>
    }
  >
    <Container>
      <InfoSection>
        <InfoItem>
          <span>Department</span>
          <strong>{trainer.ucGetResponse.gender}</strong>
        </InfoItem>
        <InfoItem>
          <span>Hired Date</span>
          <strong>{trainer.ucGetResponse.birthdate}</strong>
        </InfoItem>
      </InfoSection>
      <ContactInfo>
        <MailOutlined />
        <span>{trainer.email}</span>
      </ContactInfo>
      <ContactInfo>
        <PhoneOutlined />
        <span>{trainer.ucGetResponse.telNo1}</span>
      </ContactInfo>
    </Container>
  </StyledCard>
);

export default TrainerCard;
