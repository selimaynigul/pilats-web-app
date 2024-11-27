import React from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button } from "antd";
import TrainerCard from "./trainer-card";
import { Link } from "react-router-dom";
import { trainerService } from "services";
import { usePagination } from "hooks";

const LoadMoreContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const TrainerList: React.FC = () => {
  const {
    items: trainers,
    loading,
    hasMore,
    loadMore,
  } = usePagination({
    fetchService: trainerService.search,
    pageSize: 8,
    sort: "DESC",
  });

  return (
    <>
      <Row gutter={[16, 16]}>
        {trainers.map((trainer: any, index: number) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Link to={`/trainers/${trainer.id}`}>
              <TrainerCard trainer={trainer} />
            </Link>
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

      {!hasMore && !loading && (
        <LoadMoreContainer>No more results</LoadMoreContainer>
      )}
    </>
  );
};

export default TrainerList;
