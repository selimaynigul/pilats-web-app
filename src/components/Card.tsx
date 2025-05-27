// Header.tsx
import React, { ReactNode } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  /*   background: white;
  height: 50px;
  border-radius: 50px;
  padding: 10px; */

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const Content = styled.div``;

const Card: React.FC<{ toolbar: ReactNode; children: ReactNode }> = ({
  toolbar,
  children,
}) => {
  return (
    <Container>
      <Toolbar>{toolbar}</Toolbar>
      <Content>{children}</Content>
    </Container>
  );
};

export default Card;
