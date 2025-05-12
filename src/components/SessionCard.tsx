import React from "react";
import styled from "styled-components";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";

const Card = styled.div`
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

interface SessionCardProps {
  session: {
    id: string;
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
  };
  onClick: (session: any) => void;
}

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

const SessionCard: React.FC<SessionCardProps> = ({ session, onClick }) => {
  const { date, start, end } = formatDateTime(
    session.startDate,
    session.endDate
  );

  return (
    <Card onClick={() => onClick(session)}>
      <div>
        <h3>{session.name}</h3>
        <p>{session.description || "No description available"}</p>
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
    </Card>
  );
};

export default SessionCard;
