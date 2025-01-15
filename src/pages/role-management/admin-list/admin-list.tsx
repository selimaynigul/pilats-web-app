import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button, message } from "antd";
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
  onAdminCountChange: (count: number) => void;
  company: any;
  isBranchMode: boolean;
}

const AdminList: React.FC<TrainerListProps> = ({
  onAdminCountChange,
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
    items: admins,
    loading,
    hasMore,
    loadMore,
  } = usePagination({
    fetchService,
    params,
  });

  useEffect(() => {
    onAdminCountChange(admins.length);
  }, [admins, onAdminCountChange]);

  const handleDelete = (id: string | number) => {
    const deleteService = isBranchMode
      ? branchAdminService.delete
      : companyAdminService.delete;

    deleteService(id)
      .then(() => {
        message.success("Admin deleted successfully");
        window.location.reload();
      })
      .catch((error) => {
        message.error("Failed to delete admin");
      });
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        {admins.map((admin: any, index: number) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <AdminCard
              onDelete={() => handleDelete(admin.id)}
              isBranchMode={isBranchMode}
              admin={admin}
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

export default AdminList;
