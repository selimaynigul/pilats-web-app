import { Col, Dropdown, Row, Spin, theme } from "antd";
import Alert from "antd/es/alert/Alert";
import { useLanguage, usePagination } from "hooks";
import React, { useState } from "react";
import { sessionService } from "services";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import SessionCard from "components/SessionCard";

const Container = styled.div`
  border-radius: 20px;
  padding: 12px;
  height: 100%;

  h2 {
    color: ${({ theme }) => theme.primary};
    margin-bottom: 24px;
  }
`;

const Sessions = styled.div`
  max-height: 71vh;
  overflow: scroll;
  overflow-x: hidden;

  @media (max-width: 768px) {
    height: 100%;
    overflow: auto;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  align-items: center;

  h2 {
    margin: 0;
  }
`;

const TrainerClassesList: React.FC<{ trainer: any }> = ({ trainer }) => {
  const [params, setParams] = useState({ trainerId: trainer?.id });
  const navigate = useNavigate();
  const { t } = useLanguage();

  const {
    items: sessions,
    loading,
    hasMore,
    loadMore,
  } = usePagination({
    fetchService: sessionService.search,
    params,
  });

  const formatDateTime = (startDate: string, endDate: string) => {
    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);

    const date = parsedStart.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    const start = parsedStart.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    const end = parsedEnd.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, start, end };
  };

  const handleSessionClick = (session: any) => {
    const sessionDate = new Date(session.startDate).toISOString().slice(0, 7); // Extract "YYYY-MM"
    navigate(`/sessions/${sessionDate}?id=${session.id}`);
  };

  return (
    <Container>
      <Header>
        <h2>{t.sessions}</h2>
      </Header>
      {trainer?.passive && (
        <Alert
          message="Deactive trainers cannot have classes!"
          type="info"
          showIcon
          closable
          style={{
            width: "100%",
            borderRadius: "15px",
            border: "1px solid #e6e3ff",
            background: "#e6e3ff",
          }}
        />
      )}
      {loading ? (
        <Spin />
      ) : (
        !trainer?.passive && (
          <Sessions>
            {trainer && (
              <Row gutter={[16, 16]}>
                {sessions.map((session: any, index) => {
                  const { date, start, end } = formatDateTime(
                    session.startDate,
                    session.endDate
                  );

                  return (
                    <Col xs={24} sm={12} key={index}>
                      <SessionCard
                        session={session}
                        onClick={handleSessionClick}
                      />
                    </Col>
                  );
                })}
              </Row>
            )}
          </Sessions>
        )
      )}
    </Container>
  );
};

export default TrainerClassesList;
