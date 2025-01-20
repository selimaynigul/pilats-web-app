import { Col, Dropdown, Row, Spin, theme } from "antd";
import Alert from "antd/es/alert/Alert";
import AddButton from "components/AddButton";
import { useLanguage, usePagination } from "hooks";
import React, { useMemo, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { sessionService } from "services";
import styled from "styled-components";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  border-radius: 20px;
  padding: 12px;
  height: 100%;

  h2 {
    color: ${({ theme }) => theme.primary};
    margin-bottom: 24px;
  }

  .ant-alert-icon {
    color: ${({ theme }) => theme.primary};
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

const EditButton = styled.div`
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;

  &:hover {
    cursor: pointer;
    background: #f6f6f6;
  }
`;

const DateTimeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  background: #f9f9f9;
  font-size: 0.9em;
  color: #555;

  .icon {
    color: ${({ theme }) => theme.primary};
    font-size: 1.2em;
  }
`;

const SessionCard = styled.div`
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  padding: 16px;
  background-color: #fff;
  transition: 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin-bottom: 12px;
    font-size: 1.1em;
    color: #333;
  }

  p {
    margin: 4px 0 12px;
    font-size: 0.9em;
    color: #666;
  }

  .date-time {
    display: flex;
    gap: 8px;
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.2);
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
    navigate(`/sessions/${sessionDate}?session=${session.id}`);
  };

  return (
    <Container>
      <Header>
        <h2>{t.sessions}</h2>
      </Header>
      {trainer && !trainer?.active && (
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
                    <SessionCard onClick={() => handleSessionClick(session)}>
                      <div>
                        <h3>{session.name}</h3>
                        <p>
                          {session.description || "No description available"}
                        </p>
                        <div className="date-time">
                          <DateTimeBox>
                            <CalendarOutlined className="icon" />
                            {date}
                          </DateTimeBox>
                          <DateTimeBox>
                            <ClockCircleOutlined className="icon" />
                            {start} - {end}
                          </DateTimeBox>
                        </div>
                      </div>
                    </SessionCard>
                  </Col>
                );
              })}
            </Row>
          )}
        </Sessions>
      )}
    </Container>
  );
};

export default TrainerClassesList;
