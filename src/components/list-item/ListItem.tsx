import React from "react";
import { Card, Avatar } from "antd";
import {
  UserOutlined,
  ArrowRightOutlined,
  PhoneFilled,
} from "@ant-design/icons";
import {
  StyledCard,
  InactiveIcon,
  Container,
  CompanyInfo,
  CompanyLogo,
  CompanyName,
  CompanyDetailButton,
  ContactButton,
  ContactInfo,
} from "./ListItemStyles";

import { BsEnvelopeFill, BsWhatsapp } from "react-icons/bs";
import { Link } from "react-router-dom";
import { ItemData, ListItemType } from "types/types";
import { capitalize } from "utils/permissionUtils";

interface ListItemProps {
  data: ItemData;
  type?: ListItemType;
}

const { Meta } = Card;

const ListItem: React.FC<ListItemProps> = ({ data, type = "default" }) => {
  const {
    id,
    isActive,
    imageUrl,
    title,
    subtitle,
    detailUrl,
    company,
    contact,
  } = data;

  const showCompanyInfo = type !== "user";
  const showContainer = type !== "company";

  const whatsappLink = contact?.whatsapp
    ? `https://wa.me/${contact.whatsapp}`
    : null;

  return (
    <StyledCard
      cover={
        detailUrl ? (
          <Link to={detailUrl}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: 16,
                paddingBottom: 0,
                gap: 12,
              }}
            >
              {!isActive && <InactiveIcon title="Inactive" />}
              <Avatar
                size={60}
                src={imageUrl ?? undefined}
                style={{ background: "lightgrey", flexShrink: 0 }}
              >
                {title?.[0]?.toUpperCase()}
              </Avatar>
              <Meta title={capitalize(title)} description={subtitle ?? ""} />
            </div>
          </Link>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: 16,
              paddingBottom: 0,
              gap: 12,
            }}
          >
            {!isActive && <InactiveIcon title="Inactive" />}{" "}
            {/* TODO: isActive düzeltilecek ters şu an*/}
            <Avatar
              size={60}
              src={imageUrl ?? undefined}
              style={{ background: "lightgrey", flexShrink: 0 }}
            >
              {title?.[0]?.toUpperCase()}
            </Avatar>
            <Meta title={capitalize(title)} description={subtitle ?? ""} />
          </div>
        )
      }
    >
      {showContainer && (
        <Container>
          {showCompanyInfo && company?.id && (
            <Link to={`/companies/${company.id}`}>
              <CompanyInfo>
                <CompanyLogo>
                  <UserOutlined style={{ fontSize: 20 }} />
                </CompanyLogo>
                <CompanyName>
                  <strong>{company.name ?? "Unnamed Company"}</strong>
                  {company.branch && <small>{company.branch}</small>}
                </CompanyName>
                <CompanyDetailButton>
                  <ArrowRightOutlined />
                </CompanyDetailButton>
              </CompanyInfo>
            </Link>
          )}

          {(contact?.email || contact?.phone || contact?.whatsapp) && (
            <ContactInfo>
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  style={{ color: "#4a4a4a" }}
                >
                  <ContactButton>
                    <BsEnvelopeFill />
                  </ContactButton>
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} style={{ color: "#4a4a4a" }}>
                  <ContactButton>
                    <PhoneFilled />
                  </ContactButton>
                </a>
              )}
              {whatsappLink && (
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
              )}
            </ContactInfo>
          )}
        </Container>
      )}
    </StyledCard>
  );
};

export default ListItem;
