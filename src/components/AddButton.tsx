import { PlusOutlined } from "@ant-design/icons";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background: ${({ theme }) => theme.contentBg};
  border-radius: 50px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  cursor: pointer;
  color: white;
  transition: 0.2s;
  flex-shrink: 0;

  &:hover {
    border: 1px solid #4d3abd;
  }

  background: ${({ theme }) => theme.primary};
  &:hover {
    transform: scale(1.1);
  }
  &:active {
    transform: scale(0.9);
  }
`;

const AddButton: React.FC<{ onClick: any }> = ({ onClick }) => {
  return (
    <Container onClick={onClick}>
      <PlusOutlined />
    </Container>
  );
};
export default AddButton;
