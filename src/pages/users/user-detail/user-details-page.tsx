import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import UserInfo from "./user-info/user-info-card";
import styled from "styled-components";
import { trainerService } from "services";
import { useParams } from "react-router-dom";

const Container = styled.div`
  height: 100%;
`;

const UserDetailsPage: React.FC = () => {
  const [trainer, setTrainer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await trainerService.getById(id);
        console.log(response.data);

        setTrainer(response.data);
      } catch (error) {
        console.error("Error fetching trainer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);
  return (
    <Container>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Row gutter={[16, 16]} style={{ height: "100%" }}>
          <Col xs={24} sm={24} md={8}>
            <UserInfo trainer={trainer} loading={loading} />
          </Col>

          <Col xs={24} sm={24} md={16}></Col>
        </Row>
      )}
    </Container>
  );
};

export default UserDetailsPage;
