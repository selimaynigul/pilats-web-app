import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Avatar, Spin, Modal, Form, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { BsEnvelopeFill, BsWhatsapp } from "react-icons/bs";
import {
  DeleteOutlined,
  EditFilled,
  PhoneFilled,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { imageService, userService } from "services";
import moment from "moment";

import { capitalize, hasRole } from "utils/permissionUtils";
import { Helmet } from "react-helmet";
import EditUserForm from "pages/users/edit-user-form/edit-user-form";

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
  color: ${({ theme }) => theme.text};

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

const UserInfo: React.FC<{ user: any; loading: any }> = ({ user, loading }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editLoading, setEditLoading] = useState(false);

  const handleEdit = () => {
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = (payload: any) => {
    setEditLoading(true);
    userService
      .update(payload)
      .then(() => {
        message.success("User updated successfully");
        window.location.reload();
        setIsEditModalVisible(false);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        message.error("Failed to update user. " + error);
      })
      .finally(() => {
        setEditLoading(false);
      });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action will permanently delete the user.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        userService
          .delete(user.id)
          .then(() => {
            message.success("User deleted successfully");
            navigate("/users");
          })
          .catch((error) => {
            console.error("Error deleting user:", error);
            message.error("Failed to delete user");
          });
      },
    });
  };

  /*  const whatsappLink = `https://wa.me/${trainer.phone.replace(/\s+/g, "")}`;

 */

  const whatsappLink = "https://wa.me/+905077845678";
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
    formData.append("id", user.id);

    await imageService.postCustomerImage(formData);
    navigate("/users");
  };

  if (loading) {
    return (
      <Container>
        <Spin size="large" style={{ margin: "auto" }} />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <p style={{ textAlign: "center" }}>User not found</p>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Pilats - {user.ucGetResponse.name} {user.ucGetResponse.surname}
        </title>
      </Helmet>
      <Container>
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
            <AvatarWrapper>
              <Avatar
                size={150}
                src={
                  "https://prod-grad.onrender.com/api/v1/images" + user.imageUrl
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
            {capitalize(`${user.ucGetResponse.name} `)}
            {capitalize(`${user.ucGetResponse.surname}`)}
          </Name>
          <Title>{user.jobName}</Title>
        </ProfileSection>

        <InfoSection>
          <InfoItem>
            <span>Email:</span> {user.email}
          </InfoItem>
          <InfoItem>
            <span>Phone:</span> {user.ucGetResponse.telNo1}
          </InfoItem>
          <InfoItem>
            <span>Birthdate:</span>{" "}
            {moment(user.ucGetResponse.birthdate).format("DD MMMM YYYY")}
          </InfoItem>
          <InfoItem>
            <span>Location:</span>{" "}
            {user.location ? user.location : "Not specified"}
          </InfoItem>
        </InfoSection>
        <ContactInfo>
          <a href={`mailto:${user.email}`} style={{ color: "#4a4a4a" }}>
            <ContactButton>
              <BsEnvelopeFill />
            </ContactButton>
          </a>
          <a href={`tel:${user.phone}`} style={{ color: "#4a4a4a" }}>
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

        <EditUserForm
          visible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onSubmit={handleEditSubmit}
          initialValues={user}
          loading={editLoading}
        />
      </Container>
    </>
  );
};

export default UserInfo;
