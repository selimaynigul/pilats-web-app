import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, Spin } from "antd";
import { Link, useParams } from "react-router-dom";
import { BsBuilding, BsEnvelopeFill } from "react-icons/bs";
import { PhoneFilled, WhatsAppOutlined } from "@ant-design/icons";
import { companyService, branchService } from "services";

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

const CompanyInfo: React.FC<{ setBranches: any }> = ({ setBranches }) => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    companyService
      .search({ id })
      .then((response) => {
        const fetchedCompany = response.data[0];
        setCompany(fetchedCompany);

        // Fetch branches using company ID
        if (fetchedCompany?.id) {
          return branchService.getByPagination({
            companyId: fetchedCompany.id,
          });
        }

        return Promise.reject("No company ID found");
      })
      .then((branchResponse) => {
        setBranches(branchResponse.data);
      })
      .catch((error) => {
        console.error("Error fetching company or branches:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Container>
        <Spin size="large" style={{ margin: "auto" }} />
      </Container>
    );
  }

  if (!company) {
    return (
      <Container>
        <p style={{ textAlign: "center" }}>Company not found</p>
      </Container>
    );
  }

  return (
    <Container>
      <ProfileSection>
        <Avatar
          size={150}
          src={company.avatarUrl || null}
          icon={<BsBuilding />}
          style={{ marginBottom: 8 }}
        />
        <Name>{company.companyName}</Name>
        <Title>İstanbul</Title>
      </ProfileSection>

      <InfoSection>
        <InfoItem>
          <span>Email:</span> {company.mail}
        </InfoItem>
        <InfoItem>
          <span>Phone:</span> {company.telNo}
        </InfoItem>
        <InfoItem>
          <span>Location:</span> {company?.location || "No address available"}
        </InfoItem>
      </InfoSection>
      <ContactInfo>
        <a href={`mailto:${company.mail}`} style={{ color: "#4a4a4a" }}>
          <ContactButton>
            <BsEnvelopeFill />
          </ContactButton>
        </a>
        <a href={`tel:${company.telNo}`} style={{ color: "#4a4a4a" }}>
          <ContactButton>
            <PhoneFilled />
          </ContactButton>
        </a>
        <a href={`tel:${company.telNo}`} style={{ color: "#4a4a4a" }}>
          <ContactButton>
            <WhatsAppOutlined />
          </ContactButton>
        </a>
      </ContactInfo>
    </Container>
  );
};

export default CompanyInfo;
