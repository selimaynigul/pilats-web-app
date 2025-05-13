import React, { useState } from "react";
import styled from "styled-components";
import {
  MoreOutlined,
  DeleteOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { Dropdown, Menu, Modal, message } from "antd";
import { companyPackageService } from "services";
import { capitalize } from "utils/permissionUtils";
import ProgressBar from "components/ProgressBar";

interface Package {
  id: string | number;
  title: string;
  price: number;
  description: string;
  features: Array<{ value: string; label: string }>;
  bonusCount: number;
  remainingBonusCount: number;
  changeCount: number;
  remainingChangeCount: number;
  creditCount: number;
  remainingCreditCount: number;
}

interface CardProps {
  package: Package;
  onDelete?: (id: string | number) => void;
  mode?: "customer" | "admin";
}

const CardContainer = styled.div<{ mode?: "customer" | "admin" }>`
  position: relative;
  background: white;
  border-radius: 20px;
  color: #4f46e5;
  border: 1px solid #e5e5e5;

  &:hover {
    cursor: ${(props) => (props.mode === "admin" ? "pointer" : "default")};
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
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const StyledOuterSliders = styled.div`
  overflow: hidden;
  width: 100%;
`;

const StyledSliders = styled.div<{ offset: number; duration: number }>`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  transform: translateX(${(props) => props.offset}%);
  transition: transform ${(props) => props.duration}ms;

  > div {
    width: 100%;
    flex-shrink: 0;
  }
`;

const ProgressItem = styled.div`
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  color: #444;
`;

const PackageCard: React.FC<CardProps> = ({
  package: pkg,
  onDelete,
  mode = "admin",
}) => {
  const {
    id,
    title,
    price,
    description,
    features,
    bonusCount,
    remainingBonusCount,
    changeCount,
    remainingChangeCount,
    creditCount,
    remainingCreditCount,
  } = pkg;

  const [showProgress, setShowProgress] = useState(false);

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

  const renderUsageProgress = (
    label: string,
    total: number,
    remaining: number
  ) => {
    if (total === 0) return null;

    return (
      <ProgressItem>
        <ProgressHeader>
          <span>{label}</span>
          <span style={{ color: "#b8b3e3", fontWeight: "bold" }}>
            {remaining}/{total}
          </span>
        </ProgressHeader>
        <ProgressBar total={total} current={remaining} height={8} />
      </ProgressItem>
    );
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

  const renderCardContent = () => (
    <CardContainer mode={mode}>
      <CardHeader>
        <Title>{capitalize(title)}</Title>
        <Price>₺{price}</Price>
      </CardHeader>
      <InfoContainer>
        <Description>{description}</Description>
        <FeatureList>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setShowProgress((prev) => !prev)}
          >
            <strong style={{ color: "#4f46e5" }}>
              {showProgress ? "Kalan Kullanımlar" : "Özellikler"}
            </strong>
            {mode !== "admin" && (
              <span
                style={{
                  color: "#4f46e5",
                  marginLeft: "auto",
                  fontSize: "16px",
                }}
              >
                {showProgress ? <LeftOutlined /> : <RightOutlined />}
              </span>
            )}
          </div>

          <StyledOuterSliders>
            <StyledSliders offset={showProgress ? -100 : 0} duration={300}>
              {/* Özellikler Slide */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                {features.map((feature, index) => (
                  <FeatureItem key={index}>
                    <FeatureValue>✔</FeatureValue>
                    <FeatureLabel>
                      {feature.value} {feature.label}
                    </FeatureLabel>
                  </FeatureItem>
                ))}
              </div>

              {/* Kalan Kullanımlar Slide */}
              {mode !== "admin" && (
                <div style={{ marginTop: "10px" }}>
                  {renderUsageProgress(
                    "Katılım hakkı",
                    creditCount,
                    remainingCreditCount
                  )}
                  {renderUsageProgress(
                    "İptal hakkı",
                    changeCount,
                    remainingChangeCount
                  )}
                  {renderUsageProgress(
                    "Bonus hakkı",
                    bonusCount,
                    remainingBonusCount
                  )}
                </div>
              )}
            </StyledSliders>
          </StyledOuterSliders>
        </FeatureList>
      </InfoContainer>
    </CardContainer>
  );

  return mode === "admin" ? (
    <Dropdown overlay={menu} trigger={["click"]}>
      {renderCardContent()}
    </Dropdown>
  ) : (
    renderCardContent()
  );
};

export default PackageCard;
