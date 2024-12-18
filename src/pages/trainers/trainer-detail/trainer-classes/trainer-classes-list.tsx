import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  border-radius: 20px;
  padding: 12px;

  h2 {
    color: ${({ theme }) => theme.primary};
    margin-bottom: 24px;
  }
`;
const ClassContainer = styled.div``;

const TrainerClassesList: React.FC = () => {
  return (
    <Container>
      <h2>Classes</h2>
      {/*       <ClassContainer>No class listed</ClassContainer>
       */}{" "}
    </Container>
  );
};
export default TrainerClassesList;
