import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, Spin } from "antd";
import { Link, useParams } from "react-router-dom";
import { BsEnvelopeFill, BsWhatsapp } from "react-icons/bs";
import {
  ArrowRightOutlined,
  PhoneFilled,
  UserOutlined,
} from "@ant-design/icons";
import { trainerService } from "services";

const Container = styled.div`
  background: white;
  border-radius: 20px;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 48px 24px;
`;

const ProfileSection = styled.div`
  text-align: center;
  max-height: 45%;
`;

const Name = styled.h2`
  font-size: 1.5em;
  margin: 10px 0 5px;
`;

const Title = styled.h4`
  font-size: 1.1em;
  color: gray;
  margin: 0;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 60%;
  padding: 0 32px;
`;

const InfoItem = styled.div`
  margin-bottom: 10px;
  font-size: 1em;
  line-height: 1.5;

  span {
    font-weight: bold;
  }
`;

const ContactInfo = styled.div`
  color: #4a4a4a;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  align-items: center;
  margin: 0 32px;
`;

const ContactButton = styled.div`
  height: 48px;
  width: 48px;
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
  border: 1px solid #f6f5ff;
  width: 90%;
  margin: auto;
  margin-top: 32px;
  height: 64px;
  padding: 12px;
  border-radius: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
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
  color: gray;
`;

const TrainerInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract trainer ID from URL
  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await trainerService.getById(id);
        console.log(response.data);

        setTrainer(response.data);
      } catch (error) {
        console.error("Error fetching trainer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Spin size="large" style={{ margin: "auto" }} />
      </Container>
    );
  }

  if (!trainer) {
    return (
      <Container>
        <p style={{ textAlign: "center" }}>Trainer not found</p>
      </Container>
    );
  }

  /*  const whatsappLink = `https://wa.me/${trainer.phone.replace(/\s+/g, "")}`;

 */

  const whatsappLink = "https://wa.me/+905077845678";

  return (
    <Container>
      <ProfileSection>
        <Avatar
          size={150}
          src={trainer.avatarUrl || null}
          icon={<UserOutlined />}
          style={{ marginBottom: 8 }}
        />
        <Name>
          {trainer.ucGetResponse.name} {trainer.ucGetResponse.surname}
        </Name>
        <Title>Pilates Eğitmeni</Title>
      </ProfileSection>

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

      <InfoSection>
        <InfoItem>
          <span>Email:</span> {trainer.email}
        </InfoItem>
        <InfoItem>
          <span>Phone:</span> {trainer.ucGetResponse.telNo1}
        </InfoItem>
        <InfoItem>
          <span>Birthdate:</span> {trainer.ucGetResponse.birthdate}
        </InfoItem>
      </InfoSection>
      <ContactInfo>
        <a href={`mailto:${trainer.email}`} style={{ color: "#4a4a4a" }}>
          <ContactButton>
            <BsEnvelopeFill />
          </ContactButton>
        </a>
        <a href={`tel:${trainer.phone}`} style={{ color: "#4a4a4a" }}>
          <ContactButton>
            <PhoneFilled />
          </ContactButton>
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#4a4a4a" }}
        >
          <ContactButton>
            <BsWhatsapp />
          </ContactButton>
        </a>
      </ContactInfo>
    </Container>
  );
};

export default TrainerInfo;
