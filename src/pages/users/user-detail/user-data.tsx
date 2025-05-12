import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSearchParams, useNavigate } from "react-router-dom";
import MeasurementsContainer from "./user-data/measurements-tab/measurement-info-container";
import SessionsContainer from "./user-data/sessions-tab/SessionsContainer";
import PackagesContainer from "./user-data/packages-tab/PackagesContainer";

const Container = styled.div`
  border-radius: 20px;
  padding: 12px;
  height: 100%;

  h2 {
    color: ${({ theme }) => theme.primary};
    margin-bottom: 24px;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: center;
  color: ${({ theme }) => theme.primary};
  font-weight: bold;

  .tab {
    padding: 8px 16px;
    border-radius: 50px;
    transition: 0.2s;
    cursor: pointer;
    font-size: 1.1em;

    &.active {
      background: ${({ theme }) => theme.primary};
      color: #fff;
    }
  }
`;

const Content = styled.div`
  height: calc(100% - 45px);
`;

const TABS = {
  sessions: "classes",
  packages: "packages",
  measurements: "measurements",
};

const UserData: React.FC<{ user: any }> = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const tabParam = searchParams.get("tab") || "sessions";
  const [activeTab, setActiveTab] = useState(
    TABS[tabParam as keyof typeof TABS] || "classes"
  );

  useEffect(() => {
    // Update state if tab param changes externally
    const currentParam = searchParams.get("tab");
    if (currentParam && TABS[currentParam as keyof typeof TABS] !== activeTab) {
      setActiveTab(TABS[currentParam as keyof typeof TABS]);
    }
  }, [searchParams]);

  const handleTabClick = (tab: keyof typeof TABS) => {
    setSearchParams({ tab });
    setActiveTab(TABS[tab]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "classes":
        return <SessionsContainer />;
      case "packages":
        return <PackagesContainer />;
      case "measurements":
        return <MeasurementsContainer />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <div
          className={`tab ${activeTab === "classes" ? "active" : ""}`}
          onClick={() => handleTabClick("sessions")}
        >
          Classes
        </div>
        <div
          className={`tab ${activeTab === "packages" ? "active" : ""}`}
          onClick={() => handleTabClick("packages")}
        >
          Packages
        </div>
        <div
          className={`tab ${activeTab === "measurements" ? "active" : ""}`}
          onClick={() => handleTabClick("measurements")}
        >
          Measurements
        </div>
      </Header>

      <Content>{renderContent()}</Content>
    </Container>
  );
};

export default UserData;
