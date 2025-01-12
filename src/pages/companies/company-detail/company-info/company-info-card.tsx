import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Avatar, Spin } from "antd";
import { Link, useParams } from "react-router-dom";
import { BsBuilding, BsEnvelopeFill } from "react-icons/bs";
import {
  PhoneFilled,
  WhatsAppOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { companyService, branchService, imageService } from "services";
import { capitalize } from "utils/permissionUtils";

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
const AvatarContainer = styled.div`
  position: relative;
  width: fit-content;
  margin: auto;
`;
const UploadOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;

  .upload-icon {
    color: white;
    font-size: 24px;
  }
`;
const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${UploadOverlay} {
    opacity: 1;
  }
`;

const CompanyInfo: React.FC<{ setBranches: any }> = ({ setBranches }) => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    companyService
      .search({ id })
      .then((response) => {
        const fetchedCompany = response.data[0];
        setCompany(fetchedCompany);

        if (fetchedCompany?.id) {
          return branchService.search({
            companyId: fetchedCompany.id,
          });
        }

        return Promise.reject("company not found");
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
  const handleAvatarClick = () => {
    fileInputRef.current?.click(); // File input'u tıklanmış gibi tetikle
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const confirm = window.confirm("Do you want to upload this image?");
    if (!confirm) return;

    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("type", file.type);
    formData.append("data", file);
    formData.append("id", company.id);

    await imageService.postCompanyImage(formData);
    window.location.reload();
  };

  return (
    <Container>
      <ProfileSection>
        <AvatarContainer onClick={handleAvatarClick}>
          <AvatarWrapper>
            <Avatar
              size={150}
              src={"http://localhost:8000/api/v1/images/" + company.imageUrl}
              icon={<UserOutlined />}
              style={{ marginBottom: 8 }}
            />
            <UploadOverlay>
              <UploadOutlined className="upload-icon" />
            </UploadOverlay>
          </AvatarWrapper>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".png"
            onChange={handleFileChange}
          />
        </AvatarContainer>
        <Name>{capitalize(company.companyName)}</Name>
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
