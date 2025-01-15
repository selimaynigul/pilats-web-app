import React from "react";
import styled from "styled-components";
import { Card, Avatar, Dropdown, Menu, Modal, message } from "antd";
import {
  UserOutlined,
  ArrowRightOutlined,
  PhoneFilled,
} from "@ant-design/icons";

import { BsEnvelopeFill, BsWhatsapp } from "react-icons/bs";
import { Link } from "react-router-dom";
import { capitalize } from "utils/permissionUtils";
import { branchAdminService, companyAdminService } from "services";

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
  width: 100%;
  border-radius: 10px;
  margin: 7px 0 15px 0;
  padding: 5px;
  display: flex;
  background: white;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
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

interface AdminCardProps {
  admin: any;
  isBranchMode: boolean;
  onDelete: any;
}

const AdminCard: React.FC<AdminCardProps> = ({
  admin,
  isBranchMode,
  onDelete,
}) => {
  const whatsappLink = `https://wa.me/+905077845678`;

  const menu = (
    <Menu>
      <Menu.Item
        key="delete"
        icon={<UserOutlined style={{ color: "red" }} />}
        onClick={onDelete}
      >
        Delete Admin
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <StyledCard
        cover={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: 16,
              paddingBottom: 0,
              gap: 12,
            }}
          >
            <Avatar
              size={60}
              src={"/api/v1/images/" + admin.imageUrl}
              style={{ background: "lightgrey" }}
            >
              {admin.ucGetResponse.name[0].toUpperCase()}
            </Avatar>
            <Meta
              title={capitalize(
                `${admin.ucGetResponse.name} ${admin.ucGetResponse.surname}`
              )}
              description={isBranchMode ? "Branch Admin" : "Company Admin"}
            />
          </div>
        }
      >
        <Container>
          <Link to={`/companies/${admin.companyId}`}>
            <CompanyInfo>
              <CompanyLogo>
                <UserOutlined style={{ fontSize: 20 }} />
              </CompanyLogo>
              <CompanyName>
                <strong>{admin.companyName}</strong>
                <small>{admin.branchName}</small>
              </CompanyName>
              <CompanyDetailButton>
                <ArrowRightOutlined />
              </CompanyDetailButton>
            </CompanyInfo>
          </Link>
          <ContactInfo>
            <Link
              to={`mailto:${admin.ucGetResponse.email}`}
              style={{ color: "#4a4a4a" }}
            >
              <ContactButton>
                <BsEnvelopeFill />
              </ContactButton>
            </Link>
            <Link
              to={`tel:${admin.ucGetResponse.phone}`}
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
    </Dropdown>
  );
};

export default AdminCard;
