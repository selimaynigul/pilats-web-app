import React from "react";
import styled from "styled-components";
import {
  RightOutlined,
  LeftOutlined,
  PlusOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ToolbarProps } from "react-big-calendar"; // Import the required type

const Nav = styled.div`
  display: flex;
  gap: 5px;
`;
const Title = styled.button`
  margin: 0;
  border: 1px solid #4d3abd;
  border-radius: 15px;
  height: 35px;
  padding: 5px 15px;
  color: #4d3abd;
  cursor: pointer;
  background: transparent;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
`;

const StyledButton = styled.button`
  border: 1px solid transparent;
  background: #e6e3ff;
  color: #4d3abd;
  border-radius: 15px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    border: 1px solid #4d3abd;
  }
`;

const StyledButton2 = styled(StyledButton)`
  width: fit-content;
  padding: 5px 15px;
`;

// Extend the ToolbarProps interface
const CustomToolbar: React.FC<ToolbarProps> = ({
  label,
  onNavigate,
  onView,
  views,
  view,
}) => {
  return (
    <div
      className="custom-toolbar"
      style={{
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "white",
        borderRadius: 20,
        padding: "10px",
      }}
    >
      {/* Navigation Buttons */}
      <Nav>
        <StyledButton2
          onClick={() => onNavigate("TODAY")}
          style={{ marginRight: "5px" }}
        >
          Today
        </StyledButton2>
        <StyledButton
          onClick={() => onNavigate("PREV")}
          style={{ marginRight: "5px" }}
        >
          <LeftOutlined />
        </StyledButton>
        <StyledButton onClick={() => onNavigate("NEXT")}>
          <RightOutlined />
        </StyledButton>
      </Nav>

      {/* Title */}
      <Title>
        {label} <DownOutlined />
      </Title>

      {/* View Selector */}
      <Nav>
        {/*   {views.map((v: any) => (
          <StyledButton2
            key={v}
            onClick={() => onView(v)}
            style={{
              marginRight: "5px",
              fontWeight: view === v ? "bold" : "normal",
            }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}{" "}
          </StyledButton2>
        ))} */}
        <StyledButton
          style={{
            border: "1px solid #5d46e5",
            color: "#5d46e5",
            background: "white",
          }}
        >
          <SearchOutlined />
        </StyledButton>
        <StyledButton style={{ background: "#5d46e5", color: "white" }}>
          <PlusOutlined />
        </StyledButton>
      </Nav>
    </div>
  );
};

export default CustomToolbar;
