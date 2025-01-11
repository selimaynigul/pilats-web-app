import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button } from "antd";
import TrainerCard from "./trainer-list-card";
import { usePagination } from "hooks";
import { trainerService } from "services";
import { Link } from "react-router-dom";
import { getCompanyId, hasRole } from "utils/permissionUtils";

const LoadMoreContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

interface TrainerListProps {
  onTrainerCountChange: (count: number) => void;
  company: any;
}

const TrainerList: React.FC<TrainerListProps> = ({
  onTrainerCountChange,
  company,
}) => {
  const params = useMemo(() => {
    const isAdmin = hasRole(["ADMIN"]);
    console.log(company);
    return {
      pageSize: 8,
      sort: "DESC",
      companyId: isAdmin
        ? company?.branchName
          ? company?.companyId
          : company?.id
        : getCompanyId(),
      branchId: company.branchName ? company.id : null,
    };
  }, [company?.id, company?.companyId]);

  const {
    items: trainers,
    loading,
    hasMore,
    loadMore,
  } = usePagination({
    fetchService: trainerService.search,
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
            <TrainerCard trainer={trainer} />
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

export default TrainerList;
