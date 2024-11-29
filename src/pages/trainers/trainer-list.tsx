import React, { useEffect } from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button } from "antd";
import TrainerCard from "./trainer-list-card";
import { Link } from "react-router-dom";
import { trainerService } from "services";
import { usePagination } from "hooks";

const LoadMoreContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

interface TrainerListProps {
  onTrainerCountChange: (count: number) => void;
}

const TrainerList: React.FC<TrainerListProps> = ({ onTrainerCountChange }) => {
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

  useEffect(() => {
    onTrainerCountChange(trainers.length);
  }, [trainers, onTrainerCountChange]);

  return (
    <>
      <Row gutter={[16, 16]}>
        {trainers.map((trainer: any, index: number) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <TrainerCard trainer={trainer} />
            {/*   <Link to={`/trainers/${trainer.id}`}>
            </Link> */}
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
        /*  <LoadMoreContainer></LoadMoreContainer> */
        <></>
      )}
    </>
  );
};

export default TrainerList;
