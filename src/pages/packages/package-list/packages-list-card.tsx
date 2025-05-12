import React from "react";
import styled from "styled-components";
import { MoreOutlined, DeleteOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Modal, message } from "antd";
import { companyPackageService } from "services";
import { capitalize } from "utils/permissionUtils";

interface CardProps {
  id: string | number;
  title: string;
  price: number;
  description: string;
  features: Array<{ value: string; label: string }>;
  onDelete?: (id: string | number) => void;
}

const CardContainer = styled.div`
  position: relative;
  background: white;
  border-radius: 20px;
  color: #4f46e5;
  border: 1px solid #e5e5e5;

  &:hover {
    cursor: pointer;
    box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e5e5e5;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: black;
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: #6a5bff;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #7c7c7c;
  margin: 15px 15px 0;
`;

const FeatureList = styled.div`
  background: #f5f3ff;
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureValue = styled.div`
  background: white;
  border: 1px solid #4f46e5;
  color: #4f46e5;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  margin-right: 10px;
`;

const FeatureLabel = styled.span`
  font-size: 0.9rem;
  color: #4f46e5;
`;

const InfoContainer = styled.div`
  padding: 0 15px 15px;
`;

const PackageCard: React.FC<CardProps> = ({
  id,
  title,
  price,
  description,
  features,
  onDelete,
}) => {
  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Package",
      content: "Are you sure you want to delete this package?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await companyPackageService.delete(parseInt(id.toString()));
          message.success("Package deleted successfully");
          onDelete && onDelete(id);
        } catch (error) {
          message.error("Failed to delete package");
          console.error(error);
        }
      },
    });
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined style={{ color: "red" }} />}
        onClick={handleDelete}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <CardContainer>
        <CardHeader>
          <Title>{capitalize(title)}</Title>
          <Price>₺{price}</Price>
        </CardHeader>
        <InfoContainer>
          <Description>{description}</Description>
          <FeatureList>
            {features.map((feature, index) => (
              <FeatureItem key={index}>
                <FeatureValue>✔</FeatureValue>
                <FeatureLabel>
                  {feature.value} {feature.label}
                </FeatureLabel>
              </FeatureItem>
            ))}
          </FeatureList>
        </InfoContainer>
      </CardContainer>
    </Dropdown>
  );
};

export default PackageCard;
