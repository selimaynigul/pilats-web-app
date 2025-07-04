import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  DeleteOutlined,
  RightOutlined,
  LeftOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Dropdown,
  Input,
  Menu,
  Modal,
  Tooltip,
  message,
} from "antd";
import type { InputRef } from "antd/es/input";
import { companyPackageService, userService } from "services";
import { capitalize, hasRole } from "utils/permissionUtils";
import ProgressBar from "components/ProgressBar";
import customerPackageService from "services/customer-package-service";
import CardInfo from "components/CardInfo";
import { useLanguage } from "hooks";
import { useTheme } from "contexts/ThemeProvider";

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
  companyId: number;
  branchId?: number | null;
  creditCount: number;
  remainingCreditCount: number;
  companyName?: string;
  branchName?: string;
  discount?: number;
}

interface CardProps {
  package: Package;
  onDelete?: (id: string | number) => void;
  mode?: "customer" | "admin";
}

const CardContainer = styled.div<{ mode?: "customer" | "admin" }>`
  position: relative;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 20px;
  color: #4f46e5;
  /*  border: 1px solid #e5e5e5; */
  transition: 0.3s;

  &:hover {
    /*  transform: translateY(-2px); */
    box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.2);
  }
`;

const CardInfoContainer = styled.div`
  padding: 0 15px;
  margin-top: 10px;

  strong {
    margin-bottom: 3px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.calendarBorder};

  &:hover {
    cursor: pointer;
  }
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: black;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text};
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: #6a5bff;
  margin-left: 5px;
`;

const DiscountPrice = styled.p`
  font-size: 0.8rem;
  color: #b0b0b0;
  margin-left: 8px;
  background: none;
  font-weight: normal;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: rgb(182, 172, 198);
  margin: 10px 10px 0;
  margin-bottom: 15px;
  line-height: 1.4;
  font-size: 0.9em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
`;

const FeatureList = styled.div`
  background: ${({ theme }) => theme.contentBg};
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
  background: transparent;
  border: 1px solid #4f46e5;
  color: ${({ theme }) => theme.title};
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
  color: ${({ theme }) => theme.title};
`;

const InfoContainer = styled.div`
  padding: 0 15px 15px;
`;

const StyledOuterSliders = styled.div`
  overflow: hidden;
  width: 100%;
`;

const StyledSliders = styled.div.withConfig({
  shouldForwardProp: (prop) => !["offset", "duration"].includes(prop),
})<{ offset: number; duration: number }>`
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
    companyId,
    branchId,
    companyName,
    branchName,
  } = pkg;

  const { t } = useLanguage();
  const { theme } = useTheme();
  const [showProgress, setShowProgress] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const inputRef = useRef<InputRef>(null);

  // Modal açıldığında inputa focus ver
  useEffect(() => {
    if (assignModalVisible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [assignModalVisible]);

  const handleUserSearch = async (value: string) => {
    setSearchLoading(true);
    try {
      const res = await userService.search({
        ucSearchRequest: { name: value },
        companyId: companyId,
      });
      setSearchResults(res?.data || []);
    } catch (error) {
      message.error("Kullanıcılar alınamadı");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Paketi Sil",
      content: "Bu paketi silmek istediğinize emin misiniz?",
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      onOk: async () => {
        try {
          if (mode === "admin") {
            await companyPackageService.delete(parseInt(id.toString()));
          } else {
            await customerPackageService.delete(parseInt(id.toString()));
          }
          message.success("Paket silindi");
          onDelete?.(id);
        } catch (error) {
          console.error(error);
          message.error("Silme işlemi başarısız oldu");
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
      {mode === "admin" && (
        <Menu.Item
          key="assign"
          icon={<UserAddOutlined />}
          onClick={() => setAssignModalVisible(true)}
        >
          {t.assignToCustomer}
        </Menu.Item>
      )}
      {(!hasRole(["BRANCH_ADMIN"]) || pkg.branchId != null) && (
        <Menu.Item
          key="delete"
          icon={<DeleteOutlined style={{ color: "red" }} />}
          onClick={handleDelete}
        >
          {t.delete}
        </Menu.Item>
      )}
    </Menu>
  );

  const renderCardContent = () => (
    <CardContainer mode={mode} onClick={(e) => e.stopPropagation()}>
      <Dropdown overlay={menu} trigger={["click"]}>
        <CardHeader>
          <Title title={capitalize(title)}>{capitalize(title)}</Title>
          {pkg.discount && pkg.discount > 0 ? (
            <DiscountPrice>
              <span
                style={{ textDecoration: "line-through", color: "#b0b0b0" }}
              >
                ₺{price}
              </span>
              <Price style={{ fontSize: "1.3rem" }}>
                ₺{pkg.price * (1 - pkg.discount / 100)}
              </Price>
            </DiscountPrice>
          ) : (
            <Price>₺{price}</Price>
          )}
        </CardHeader>
      </Dropdown>
      {hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN", "ADMIN"]) &&
        mode === "admin" && (
          <CardInfoContainer>
            <CardInfo
              title={companyName || null}
              detail={branchName || null}
              to={`/companies/${companyId}`}
            />
          </CardInfoContainer>
        )}
      <InfoContainer>
        {description && (
          <Tooltip title={description} mouseEnterDelay={0.5}>
            <Description>{description}</Description>
          </Tooltip>
        )}{" "}
        <FeatureList>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              if (mode === "admin") return;
              setShowProgress((prev) => !prev);
            }}
          >
            <strong style={{ color: theme.title }}>
              {showProgress ? t.remainingUsages : t.features}
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

  // Sonuçları filtrele
  const filteredResults = searchResults.filter((user) => {
    const userCompanyId = user.companyId ?? user.ucGetResponse?.companyId;
    const userBranchId = user.branchId ?? user.ucGetResponse?.branchId;
    const sameCompany = userCompanyId === companyId;
    const sameBranch = pkg.branchId == null || userBranchId === pkg.branchId;
    return sameCompany && sameBranch;
  });

  return (
    <>
      {renderCardContent()}
      <Modal
        title={t.assignToCustomer}
        open={assignModalVisible}
        onCancel={() => {
          setAssignModalVisible(false);
          setSearchValue("");
          setSearchResults([]);
        }}
        footer={null}
        closable={false}
      >
        <Input
          ref={inputRef}
          type="text"
          value={searchValue}
          onFocus={() => {
            handleUserSearch("");
          }}
          onChange={(e) => {
            const val = e.target.value;
            setSearchValue(val);
            if (val.trim().length > 0) handleUserSearch(val);
            else setSearchResults([]);
          }}
          placeholder="Müşteri ara"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />

        {searchLoading ? (
          <p>Yükleniyor...</p>
        ) : filteredResults.length === 0 && searchValue.trim() ? (
          <p>Kullanıcı bulunamadı</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {filteredResults.map((user) => (
              <li
                key={user.id}
                onClick={async () => {
                  try {
                    await customerPackageService.assign({
                      customerId: user.id,
                      companyPackageId: pkg.id,
                    });
                    message.success("Paket başarıyla atandı");
                    setAssignModalVisible(false);
                    setSearchValue("");
                    setSearchResults([]);
                  } catch (error: any) {
                    console.error(error);

                    if (error.response?.data.errorCode === 1901) {
                      message.error("Kullanıcıya daha önce paket tanımlanmış");
                    }
                  }
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <Avatar
                  src={`https://uat-platesapi-latest.onrender.com/api/v1/images${user.imageUrl}`}
                  size={32}
                >
                  {user.ucGetResponse.name?.[0]}
                </Avatar>
                <div>
                  <strong>
                    {user.ucGetResponse.name} {user.ucGetResponse.surname}
                  </strong>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </>
  );
};

export default PackageCard;
