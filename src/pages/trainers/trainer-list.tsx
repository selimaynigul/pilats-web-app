import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button, message } from "antd";
import TrainerCard from "./trainer-card";
import { Link } from "react-router-dom";
import { trainerService } from "services";

const TrainerListContainer = styled.div``;

const LoadMoreContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const TrainerList: React.FC = () => {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchTrainers = (page: number) => {
    setLoading(true);

    trainerService
      .search({
        searchByPageDto: {
          page,
          size: 8,
          sort: "DESC",
        },
      })
      .then((response) => {
        const newTrainers = response.data;

        if (newTrainers.length === 0) {
          setHasMore(false);
        } else {
          setTrainers((prev) => [...prev, ...newTrainers]);
        }
      })
      .catch((error) => {
        console.error("Error fetching trainers:", error);
        message.error("Failed to fetch trainers");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrainers(page);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTrainers(nextPage);
  };

  return (
    <TrainerListContainer>
      <Row gutter={[16, 16]}>
        {trainers.map((trainer, index) => (
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
          <Button type="primary" onClick={handleLoadMore}>
            Load More
          </Button>
        </LoadMoreContainer>
      )}

      {!hasMore && !loading && (
        <LoadMoreContainer>No more results</LoadMoreContainer>
      )}
    </TrainerListContainer>
  );
};

export default TrainerList;
