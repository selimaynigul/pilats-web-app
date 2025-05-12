import React, { useMemo } from "react";
import { Col, Row, Spin } from "antd";
import styled from "styled-components";
import SessionCard from "components/SessionCard";
import { sessionService } from "services";
import { usePagination } from "hooks";
import { useNavigate, useParams } from "react-router-dom";

const Sessions = styled.div`
  max-height: 71vh;
  overflow-x: hidden;

  @media (max-width: 768px) {
    height: 100%;
    overflow: auto;
  }
`;

const SessionsContainer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // URL'den :id al

  const params = useMemo(() => {
    return {
      sessionCustomerLastEventSearchRequest: {
        sessionCustomerEventsList: ["JOINED", "ATTENDED"],
        customerId: parseInt(id || "0", 10), // customerId olarak kullan
      },
    };
  }, [id]);

  const {
    items: sessions,
    loading,
    hasMore,
    loadMore,
  } = usePagination({
    fetchService: sessionService.getCustomerSessions,
    params,
  });

  const handleSessionClick = (session: any) => {
    const sessionDate = new Date(session.startDate).toISOString().slice(0, 7);
    navigate(`/sessions/${sessionDate}?id=${session.id}`);
  };

  return (
    <Sessions onScroll={loadMore}>
      {loading && sessions.length === 0 ? (
        <Spin />
      ) : (
        <Row gutter={[16, 16]}>
          {sessions.map((session: any) => (
            <Col xs={24} sm={12} key={session.id}>
              <SessionCard session={session} onClick={handleSessionClick} />
            </Col>
          ))}
        </Row>
      )}
    </Sessions>
  );
};

export default SessionsContainer;
