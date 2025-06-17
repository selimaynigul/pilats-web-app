import React from "react";
import styled from "styled-components";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import { PiClockClockwiseFill } from "react-icons/pi";
import { TiCancel } from "react-icons/ti";
import { FaCheck } from "react-icons/fa";

const Card = styled.div`
  /*  border: 1px solid #e6e6e6; */
  border-radius: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.cardBg};
  transition: 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin-bottom: 12px;
    font-size: 1.1em;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 4px 0 12px;
    font-size: 0.9em;
    color: ${({ theme }) => theme.text}90;
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
  border: 1px solid ${({ theme }) => theme.calendarBorder};
  border-radius: 8px;
  background: ${({ theme }) => theme.contentBg};
  font-size: 0.9em;
  color: ${({ theme }) => theme.text};

  .icon {
    color: ${({ theme }) => theme.primary};
    font-size: 1.2em;
  }
`;

interface SessionCardProps {
  session: any;
  onClick: (session: any) => void;
  isJoinedButNotAttended?: boolean;
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

  const isAttended = session.customerLastEvent === "ATTENDED";
  const isSessionStarted = new Date(session.startDate) < new Date();
  const isPostponed = session.customerLastEvent === "POSTPONED";
  const isCancelled = session.customerLastEvent === "CANCELLED";

  return (
    <Card onClick={() => onClick(session)}>
      <div style={{ position: "relative", width: "100%" }}>
        {session.customerLastEvent && isSessionStarted && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 10px 4px 4px",
              borderRadius: 20,
              background: isAttended
                ? "#7be3a4"
                : isPostponed
                  ? "#ffc069"
                  : isCancelled
                    ? "#d9d9d9"
                    : "#ff6e7f",
              color: "#fff",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: isAttended
                  ? "#6cc48f"
                  : isPostponed
                    ? "#ffa940"
                    : isCancelled
                      ? "#bfbfbf"
                      : "#d95b6a",
                color: "#fff",
              }}
            >
              {isAttended ? (
                <FaCheck style={{ fontSize: 12 }} />
              ) : isPostponed ? (
                <PiClockClockwiseFill style={{ fontSize: 15 }} />
              ) : isCancelled ? (
                <TiCancel style={{ fontSize: 18 }} />
              ) : (
                <CloseOutlined style={{ fontSize: 12 }} />
              )}
            </div>
            <span>
              {isAttended
                ? "Katıldı"
                : isPostponed
                  ? "Ertelendi"
                  : isCancelled
                    ? "İptal Edildi"
                    : "Katılmadı"}
            </span>
          </div>
        )}

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
