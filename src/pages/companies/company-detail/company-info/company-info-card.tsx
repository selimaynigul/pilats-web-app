import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Avatar, Button, message, Modal, Spin } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsBuilding, BsEnvelopeFill } from "react-icons/bs";
import {
  PhoneFilled,
  WhatsAppOutlined,
  UserOutlined,
  UploadOutlined,
  EditFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import { companyService, branchService, imageService } from "services";
import { capitalize, hasRole } from "utils/permissionUtils";
import { Helmet } from "react-helmet";
import EditCompanyForm from "pages/companies/edit-company-form/edit-company-form";

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

const ActionButtons = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      color: ${({ theme }) => theme.primary};
    }
  }
`;

const EditButton = styled(Button)`
  border-radius: 10px;
  background: transparent;
  border: 1px solid white;
  width: 36px;
  height: 36px;
  color: grey;
  box-shadow: none;
  &:hover {
    background: transparent !important;
    color: grey !important;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 12px;
  }
`;

const DeleteButton = styled(Button)`
  border-radius: 10px;
  background: transparent;
  border: 1px solid #f54263;
  width: 36px;
  height: 36px;
  color: #f54263;
  box-shadow: none;
  &:hover {
    background: #f54263 !important;
    color: white !important;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 12px;
  }
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

const CompanyInfo: React.FC<{
  setCompanyId: any;
  fetchBranches: any;
}> = ({ setCompanyId, fetchBranches }) => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [editLoading, setEditLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    companyService
      .search({ id })
      .then(async (response) => {
        const fetchedCompany = response.data[0];
        setCompany(fetchedCompany);

        if (fetchedCompany?.id) {
          setCompanyId(fetchedCompany.id);
          await fetchBranches(fetchedCompany.id);
        }
      })
      .catch((error) => {
        console.error("Error fetching company or branches:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (payload: any) => {
    setEditLoading(true);
    try {
      await companyService.update(payload);
      setIsEditModalVisible(false);
      const response = await companyService.search({ id });
      setCompany(response.data[0]);
      message.success("Company updated successfully");
    } catch (error) {
      console.error("Error updating company:", error);
      message.error("Failed to update company.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action will permanently delete the company.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        companyService
          .delete(company.id)
          .then(() => {
            message.success("Comppany deleted successfully");
            navigate("/companies");
          })
          .catch((error) => {
            console.error("Error deleting company:", error);
            message.error("Failed to delete company");
          });
      },
    });
  };

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
    <>
      <Helmet>
        <title>Pilats - {company.companyName}</title>
      </Helmet>
      <Container>
        {hasRole(["ADMIN"]) && (
          <ActionButtons>
            <EditButton onClick={handleEdit} type="primary">
              <EditFilled />
            </EditButton>
            {hasRole(["ADMIN"]) && (
              <DeleteButton onClick={handleDelete} type="primary">
                <DeleteOutlined />
              </DeleteButton>
            )}
          </ActionButtons>
        )}
        <ProfileSection>
          <AvatarContainer onClick={handleAvatarClick}>
            <AvatarWrapper>
              <Avatar
                size={150}
                src={
                  "https://prod-grad.onrender.com/api/v1/images" +
                  company.imageUrl
                }
                icon={<UserOutlined />}
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

      <EditCompanyForm
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSubmit={handleEditSubmit}
        initialValues={company}
        loading={editLoading}
      />
    </>
  );
};

export default CompanyInfo;
