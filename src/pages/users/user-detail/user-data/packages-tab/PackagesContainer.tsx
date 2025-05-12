import React, { useEffect, useState } from "react";
import { Col, Row, Spin, Alert } from "antd";
import styled from "styled-components";
import PackageCard from "pages/packages/package-list/packages-list-card";
import customerPackageService from "services/customer-package-service";
import { useParams } from "react-router-dom";

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
  const { id } = useParams<{ id: string }>(); // URL'den id'yi al
  const customerId = parseInt(id || "0", 10); // Sayıya çevir, default 0

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
          message="Bu kullanıcıya herhangi bir paket atanmamış."
          type="info"
          showIcon
          style={{ borderRadius: 8 }}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {packages.map((pkg) => (
            <Col xs={24} sm={12} md={8} key={pkg.id}>
              <PackageCard
                id={pkg.id}
                title={pkg.name} // dikkat: "title" değil "name"
                price={pkg.price}
                description={pkg.description}
                features={[
                  { value: "✔", label: `${pkg.creditCount} credit` },
                  { value: "✔", label: `${pkg.bonusCount} bonus` },
                  { value: "✔", label: `${pkg.changeCount} change rights` },
                ]}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default PackagesContainer;
