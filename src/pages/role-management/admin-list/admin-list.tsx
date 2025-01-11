import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button } from "antd";
import AdminCard from "./admin-list-card";
import { usePagination } from "hooks";
import {
  branchAdminService,
  companyAdminService,
  trainerService,
} from "services";
import { Link } from "react-router-dom";
import { hasRole } from "utils/permissionUtils";

const LoadMoreContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

interface TrainerListProps {
  onTrainerCountChange: (count: number) => void;
  company: any;
  isBranchMode: boolean;
}

const AdminList: React.FC<TrainerListProps> = ({
  onTrainerCountChange,
  company,
  isBranchMode,
}) => {
  const params = useMemo(
    () => ({
      pageSize: 8,
      sort: "DESC",
      companyId: company.branchName ? company.companyId : company.id || null,
      branchId: company.branchName ? company.id : null,
    }),
    [company?.id]
  );

  const fetchService = useMemo(
    () =>
      isBranchMode ? branchAdminService.search : companyAdminService.search,
    [isBranchMode]
  );

  const {
    items: trainers,
    loading,
    hasMore,
    loadMore,
  } = usePagination({
    fetchService,
    params,
  });

  useEffect(() => {
    onTrainerCountChange(trainers.length);
  }, [trainers, onTrainerCountChange]);

  return (
    <>
      <Row gutter={[16, 16]}>
        {trainers.map((trainer: any, index: number) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <AdminCard trainer={trainer} />
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

export default AdminList;
