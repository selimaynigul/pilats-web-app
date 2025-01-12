import React, { useEffect, useState } from "react";
import { Row, Col, Spin } from "antd";
import UserInfo from "./user-info/user-info-card";
import styled from "styled-components";
import { userService } from "services";
import { useParams } from "react-router-dom";
import UserData from "./user-data";

const Container = styled.div`
  height: 100%;
`;

const UserDetailsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getById(id);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);
  return (
    <Container>
      {loading ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]} style={{ height: "100%" }}>
          <Col xs={24} sm={24} md={8}>
            <UserInfo user={user} loading={loading} />
          </Col>

          <Col xs={24} sm={24} md={16}>
            <UserData user={user} />
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default UserDetailsPage;
