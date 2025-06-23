import React, { useMemo, useState } from "react";
import { Alert, Col, Row, Spin, Checkbox } from "antd";
import styled from "styled-components";
import SessionCard from "components/SessionCard";
import { sessionService } from "services";
import { useLanguage, usePagination } from "hooks";
import { useNavigate, useParams } from "react-router-dom";

const Sessions = styled.div`
  max-height: 71vh;
  overflow-x: hidden;

  @media (max-width: 768px) {
    height: 100%;
    overflow: auto;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  margin-left: 8px;
  span {
    color: grey !important;
  }
  overflow-x: auto; /* Yatay scroll için */
  white-space: nowrap; /* Satır atlamayı önler */
  -webkit-overflow-scrolling: touch; /* Mobilde daha iyi scroll deneyimi */
`;

const SessionsContainer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();

  const [selectedFilters, setSelectedFilters] = useState<string[]>(["ALL"]);

  const handleFilterChange = (checked: boolean, filter: string) => {
    if (filter === "ALL") {
      setSelectedFilters(checked ? ["ALL"] : []);
    } else {
      setSelectedFilters((prev) => {
        const updatedFilters = checked
          ? [...prev.filter((f) => f !== "ALL"), filter] // "Tümü" seçeneğini kaldır
          : prev.filter((f) => f !== filter);

        // Eğer diğer 4 checkbox seçili değilse "Tümü" seçili olsun
        if (
          !updatedFilters.includes("JOINED") &&
          !updatedFilters.includes("ATTENDED") &&
          !updatedFilters.includes("POSTPONED") &&
          !updatedFilters.includes("CANCELLED")
        ) {
          return ["ALL"];
        }

        return updatedFilters;
      });
    }
  };

  const params = useMemo(() => {
    return {
      sessionCustomerLastEventSearchRequest: {
        sessionCustomerEventsList: selectedFilters.includes("ALL")
          ? ["JOINED", "ATTENDED", "POSTPONED", "CANCELLED"]
          : selectedFilters,
        customerId: parseInt(id || "0", 10),
      },
    };
  }, [id, selectedFilters]);

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
    const calendarView = localStorage.getItem("savedCalendarView");
    const sessionDate = new Date(session.startDate);

    const formattedDate =
      calendarView === "day" || calendarView === "week"
        ? sessionDate.toISOString().slice(0, 10) // YYYY-MM-DD
        : sessionDate.toISOString().slice(0, 7); // YYYY-MM

    navigate(`/sessions/${formattedDate}?id=${session.id}`);
  };

  const isJoinedButNotAttended = (session: any) => {
    return (
      session.customerLastEvent === "JOINED" &&
      new Date(session.endDate) < new Date()
    );
  };

  return (
    <>
      {/* Checkbox Filter */}
      <FilterContainer>
        <Checkbox
          checked={selectedFilters.includes("ALL")}
          onChange={(e) => handleFilterChange(e.target.checked, "ALL")}
        >
          {t.all}
        </Checkbox>
        <Checkbox
          checked={selectedFilters.includes("JOINED")}
          onChange={(e) => handleFilterChange(e.target.checked, "JOINED")}
        >
          {t.notAttended}
        </Checkbox>
        <Checkbox
          checked={selectedFilters.includes("ATTENDED")}
          onChange={(e) => handleFilterChange(e.target.checked, "ATTENDED")}
        >
          {t.attended}
        </Checkbox>
        <Checkbox
          checked={selectedFilters.includes("POSTPONED")}
          onChange={(e) => handleFilterChange(e.target.checked, "POSTPONED")}
        >
          {t.postponed}
        </Checkbox>
        <Checkbox
          checked={selectedFilters.includes("CANCELLED")}
          onChange={(e) => handleFilterChange(e.target.checked, "CANCELLED")}
        >
          {t.cancelled}
        </Checkbox>
      </FilterContainer>

      {/* Session Cards */}
      <Sessions>
        {loading ? (
          <Spin />
        ) : sessions.length === 0 ? (
          <Alert
            message="Herhangi bir ders bulunamadı."
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
        ) : (
          <Row gutter={[16, 16]}>
            {sessions.map((session: any) => (
              <Col sm={24} md={12} key={session.id}>
                <SessionCard
                  session={session}
                  onClick={handleSessionClick}
                  isJoinedButNotAttended={isJoinedButNotAttended(session)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Sessions>
    </>
  );
};

export default SessionsContainer;
