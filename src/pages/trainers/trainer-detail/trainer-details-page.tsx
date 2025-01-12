import React, { useEffect, useState } from "react";
import { Row, Col, Spin } from "antd";
import TrainerInfo from "./trainer-info/trainer-info-card";
import TrainerClassesList from "./trainer-classes/trainer-classes-list";
import styled from "styled-components";
import { trainerService } from "services";
import { useParams } from "react-router-dom";

const Container = styled.div`
  height: 100%;
`;

const TrainerDetailPage: React.FC = () => {
  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await trainerService.getById(id);
        setTrainer(response.data);
      } catch (error) {
        console.error("Error fetching trainer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);
  return (
    <Container>
      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]} style={{ height: "100%" }}>
          <Col xs={24} sm={24} md={8}>
            <TrainerInfo trainer={trainer} loading={loading} />
          </Col>
          <Col xs={24} sm={24} md={16}>
            <TrainerClassesList trainer={trainer} />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default TrainerDetailPage;
