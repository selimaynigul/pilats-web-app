import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button } from "antd";
import { useLanguage, usePagination } from "hooks";
import { companyPackageService, trainerService } from "services";
import { Link } from "react-router-dom";
import PackageCard from "./packages-list-card";
import { getCompanyId, hasRole } from "utils/permissionUtils";
import { ListContainer } from "components";

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
  const { t } = useLanguage();

  const params = useMemo(() => {
    const isAdmin = hasRole(["ADMIN"]);
    return {
      pageSize: 8,
      sort: "DESC",
      companyId: isAdmin
        ? company?.branchName
          ? company?.companyId
          : company?.id
        : getCompanyId(),
      branchId: company.companyParam
        ? company.branchParam || (company.branchName ? company.id : null)
        : company.branchName
          ? company.id
          : null,
    };
  }, [company?.id, company?.companyId]);
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
    <ListContainer>
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
                  { value: item.creditCount, label: t.credit },
                  { value: item.changeCount, label: t.cancelRight },
                  { value: item.bonusCount, label: t.bonusRight },
                ],
                bonusCount: item.bonusCount,
                remainingBonusCount: item.remainingBonusCount,
                changeCount: item.changeCount,
                remainingChangeCount: item.remainingChangeCount,
                creditCount: item.creditCount,
                remainingCreditCount: item.remainingCreditCount,
                companyId: item.companyId,
                branchId: item.branchId,
                companyName: item.companyName,
                branchName: item.branchName,
                discount: item.discount,
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
          <Button onClick={loadMore}>{t.loadMore}</Button>
        </LoadMoreContainer>
      )}

      {!hasMore && !loading && <></>}
    </ListContainer>
  );
};

export default PackageList;
