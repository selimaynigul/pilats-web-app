import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button } from "antd";
import TrainerCard from "./trainer-list-card";
import { usePagination } from "hooks";
import { trainerService } from "services";
import { getCompanyId, hasRole } from "utils/permissionUtils";
import { ListContainer, ListItem } from "components";
import { mapToItemData } from "utils/utils";

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
    <ListContainer>
      <Row gutter={[16, 16]}>
        {trainers.map((trainer: any, index: number) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <ListItem
              data={mapToItemData({
                ...trainer,
                detailUrl: "/trainers",
              })}
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
    </ListContainer>
  );
};

export default TrainerList;
