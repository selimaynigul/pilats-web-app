import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button } from "antd";
import TrainerCard from "./trainer-list-card";
import { usePagination } from "hooks";
import { trainerService } from "services";

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
  const params = useMemo(
    () => ({
      pageSize: 8,
      sort: "DESC",
      companyId: company?.id,
    }),
    [company?.id]
  );

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
          <Button type="primary" onClick={loadMore}>
            Load More
          </Button>
        </LoadMoreContainer>
      )}

      {!hasMore && !loading && <></>}
    </>
  );
};

export default TrainerList;
