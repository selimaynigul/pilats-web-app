import {
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";

import styled from "styled-components";

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

const CompanyItem = styled.div`
  background: white;
  border-radius: 20px;
  height: 80px;
  width: 100%;
  padding: 20px;
  display: flex;
`;

const HomePage: React.FC = () => {
  return <div></div>;
};

export default HomePage;
