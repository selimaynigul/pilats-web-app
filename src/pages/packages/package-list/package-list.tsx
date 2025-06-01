import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button } from "antd";
import { usePagination } from "hooks";
import { companyPackageService, trainerService } from "services";
import { Link } from "react-router-dom";
import PackageCard from "./packages-list-card";

const LoadMoreContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

interface PackageListProps {
  onTrainerCountChange: (count: number) => void;
  company: any;
}

const PackageList: React.FC<PackageListProps> = ({
  onTrainerCountChange,
  company,
}) => {
  const params = useMemo(
    () => ({
      pageSize: 8,
      sort: "DESC",
      companyId: company?.id,
    }),
    [company?.id]
  );

  const {
    items: packages,
    loading,
    hasMore,
    loadMore,
  } = usePagination({
    fetchService: companyPackageService.search,
    params,
  });

  useEffect(() => {
    onTrainerCountChange(packages.length);
  }, [packages, onTrainerCountChange]);

  return (
    <>
      <Row gutter={[16, 16]}>
        {packages.map((item: any, index: number) => (
          <Col xs={24} sm={12} md={12} lg={6} key={index}>
            <PackageCard
              package={{
                id: item.id,
                title: item.name,
                price: item.price,
                description: item.description,
                features: [
                  { value: item.creditCount, label: "katılım hakkı" },
                  { value: item.changeCount, label: "iptal hakkı" },
                  { value: item.bonusCount, label: "bonus hakkı" },
                ],
                bonusCount: item.bonusCount,
                remainingBonusCount: item.remainingBonusCount,
                changeCount: item.changeCount,
                remainingChangeCount: item.remainingChangeCount,
                creditCount: item.creditCount,
                remainingCreditCount: item.remainingCreditCount,
                companyId: item.companyId,
              }}
              mode="admin"
              onDelete={() => {
                window.location.reload();
              }}
            />
          </Col>
        ))}
      </Row>

      {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}

      {!loading && hasMore && (
        <LoadMoreContainer>
          <Button onClick={loadMore}>Load More</Button>
        </LoadMoreContainer>
      )}

      {!hasMore && !loading && <></>}
    </>
  );
};

export default PackageList;
