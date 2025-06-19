import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Avatar, Spin, Modal, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { BsBuilding, BsEnvelopeFill, BsWhatsapp } from "react-icons/bs";
import {
  ArrowRightOutlined,
  DeleteOutlined,
  EditFilled,
  PhoneFilled,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { imageService, trainerService } from "services";
import moment from "moment";
import { capitalize, hasRole } from "utils/permissionUtils";
import EditTrainerForm from "../edit-trainer-form/edit-trainer-form";
import { Helmet } from "react-helmet";

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
const Container = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 20px;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 48px 24px;
  padding-top: 32px;
  position: relative;
  overflow: hidden;
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
const ProfileSection = styled.div`
  text-align: center;
  max-height: 45%;
`;

const Name = styled.h2`
  font-size: 1.5em;
  margin: 10px 0 5px;
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h4`
  font-size: 1.1em;
  color: gray;
  margin: 0;
  color: ${({ theme }) => theme.text};
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
  color: ${({ theme }) => theme.text}90;

  span {
    color: ${({ theme }) => theme.text};
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
  margin-top: 12px;
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
    color: black;
  }
  small {
    color: gray;
  }
`;
const AvatarContainer = styled.div`
  position: relative;
  width: fit-content;
  margin: auto;
`;
const InactiveIcon = styled.div`
  background: #f54263;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  position: absolute;
  left: 15px;
  top: 4px;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid white;
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

const Status = styled.div`
  background: black;
  opacity: 0.25;
  width: 95%;
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 10px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 0;
  font-size: 0.9em;
`;

const TrainerInfo: React.FC<{
  trainer: any;
  loading: boolean;
  refresh: any;
}> = ({ trainer, loading, refresh }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editLoading, setEditLoading] = useState(false);

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (payload: any) => {
    setEditLoading(true);
    try {
      await trainerService.update(payload);
      setIsEditModalVisible(false);
      refresh();
      message.success("Trainer updated successfully");
    } catch (error) {
      console.error("Error updating trainer:", error);
      message.error("Failed to update trainer.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action will permanently delete the trainer.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        trainerService
          .delete(trainer.id)
          .then(() => {
            message.success("Trainer deleted successfully");
            navigate("/trainers");
          })
          .catch((error) => {
            console.error("Error deleting trainer:", error);
            message.error("Failed to delete trainer");
          });
      },
    });
  };

  /*  const whatsappLink = `https://wa.me/${trainer.phone.replace(/\s+/g, "")}`;

 */

  const whatsappLink = "https://wa.me/+905077845678";

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
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
    formData.append("id", trainer.id);

    await imageService.postTrainerImage(formData);
    window.location.reload();
  };

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

  return (
    <>
      <Helmet>
        <title>
          Pilats - {trainer.ucGetResponse.name} {trainer.ucGetResponse.surname}
        </title>
      </Helmet>
      <Container>
        {/*  {!trainer.active && <Status>Not active</Status>} */}
        {!hasRole(["COMPANY_ADMIN"]) && (
          <ActionButtons>
            <EditButton onClick={handleEdit} type="primary">
              <EditFilled />
            </EditButton>
            <DeleteButton onClick={handleDelete} type="primary">
              <DeleteOutlined />
            </DeleteButton>
          </ActionButtons>
        )}

        <ProfileSection>
          <AvatarContainer onClick={handleAvatarClick}>
            {trainer.passive && <InactiveIcon title="Not working" />}
            <AvatarWrapper>
              <Avatar
                size={150}
                src={
                  "https://prod-grad.onrender.com/api/v1/images" +
                  trainer.imageUrl
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
          <Name>
            {capitalize(`${trainer.ucGetResponse.name} `)}
            {capitalize(`${trainer.ucGetResponse.surname}`)}
          </Name>
          <Title>{trainer.jobName}</Title>
        </ProfileSection>

        <Link to={`/companies/${trainer.companyId}`}>
          <CompanyInfo>
            <CompanyLogo>
              <BsBuilding style={{ fontSize: 20 }} />
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
            <span>Birthdate:</span>{" "}
            {moment(trainer.ucGetResponse.birthdate).format("DD MMMM YYYY")}
          </InfoItem>
          <InfoItem>
            <span>Location:</span>{" "}
            {trainer.location ? trainer.location : "Not specified"}
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

        <EditTrainerForm
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onSubmit={handleEditSubmit}
          initialValues={trainer}
          loading={editLoading}
        />
      </Container>
    </>
  );
};

export default TrainerInfo;
