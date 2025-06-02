import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    max-height: calc(100vh - 180px);
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(93, 70, 229, 0.2);
    border-radius: 3px;
  }
`;

const ListContainer: React.FC<{ children: any }> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default ListContainer;
