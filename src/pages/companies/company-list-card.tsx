import React from "react";
import styled from "styled-components";
import { Card, Avatar } from "antd";

import { Link } from "react-router-dom";
import { BsBuilding } from "react-icons/bs";
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

  .ant-card-body {
    display: none;
  }

  .ant-card-meta-title {
    margin-bottom: 0 !important;
  }
`;

const CompanyListCard: React.FC<{ company: any }> = ({ company }) => {
  return (
    <StyledCard
      cover={
        <Link to={`/companies/${company.id}`}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: 16,
              gap: 12,
            }}
          >
            <Avatar
              size={60}
              src={"http://localhost:8000/api/v1/images/" + company.imageUrl}
              style={{
                background: "lightgrey",
                fontSize: 24,
                paddingTop: 8,
              }}
            >
              <BsBuilding />
            </Avatar>
            <Meta
              title={capitalize(company.companyName)}
              description="İstanbul"
            />
          </div>
        </Link>
      }
    ></StyledCard>
  );
};

export default CompanyListCard;
