import React, { useEffect, useState } from "react";
import { Col, Row, Spin, Alert } from "antd";
import styled from "styled-components";
import PackageCard from "pages/packages/package-list/packages-list-card";
import customerPackageService from "services/customer-package-service";
import { useParams } from "react-router-dom";
import { useLanguage } from "hooks";

const Container = styled.div`
  max-height: 71vh;
  overflow-x: hidden;
  padding-right: 8px;

  @media (max-width: 768px) {
    height: 100%;
    overflow: auto;
  }
`;

const PackagesContainer: React.FC = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const customerId = parseInt(id || "0", 10);
  const { t } = useLanguage();

  const fetchCustomerPackages = async () => {
    try {
      const response = await customerPackageService.search({ customerId });
      setPackages(response);
    } catch (error) {
      console.error("Paketler alınırken hata oluştu:", error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string | number) => {
    setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
  };

  useEffect(() => {
    fetchCustomerPackages();
  }, []);

  return (
    <Container>
      {loading ? (
        <Spin />
      ) : packages.length === 0 ? (
        <Alert
          message="Herhangi bir paket atanmamış"
          type="info"
          showIcon
          closable
          style={{
            width: "100%",
            borderRadius: "15px",
            border: "1px solid #e6e3ff",
            background: "#e6e3ff",
          }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {packages.map((pkg) => (
            <Col xs={24} sm={12} key={pkg.id}>
              <PackageCard
                package={{
                  id: pkg.id,
                  title: pkg.name,
                  price: pkg.price,
                  description: pkg.description,
                  features: [
                    { value: pkg.creditCount, label: t.credit },
                    { value: pkg.changeCount, label: t.cancelRight },
                    { value: pkg.bonusCount, label: t.bonusRight },
                  ],
                  bonusCount: pkg.bonusCount,
                  remainingBonusCount: pkg.remainingBonusCount,
                  changeCount: pkg.changeCount,
                  remainingChangeCount: pkg.remainingChangeCount,
                  creditCount: pkg.creditCount,
                  remainingCreditCount: pkg.remainingCreditCount,
                  companyId: pkg.companyId,
                }}
                onDelete={() => handleDelete(pkg.id)}
                mode="customer"
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default PackagesContainer;
