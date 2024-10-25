import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background: #14102b;
`;

const Left = styled.div`
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    display: none;
  }
`;
const Right = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  height: 600px;
  width: 60%;
  border-radius: 30px;
  backdrop-filter: blur(8px);
  border: 1px solid white;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const Cover = styled.div`
  box-sizing: border-box;
  padding: 20px;
  width: 100%;
  height: 100%;
  border-radius: 30px;
  background: #14102b;
  position: relative;

  display: flex;
  flex-direction: column;
  padding: 60px 20px;
  align-items: center;
  color: white;
  justify-content: space-between;

  @property --angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }

  &::after,
  &::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    z-index: -1;
    padding: 1px;
    border-radius: 30px;
    background-image: conic-gradient(
      from var(--angle),
      transparent 10%,
      #5d46e5,
      white
    );
    animation: 30s spin linear infinite;
  }

  &::before {
    filter: blur(1.5rem);
    opacity: 0.5;
  }

  @keyframes spin {
    from {
      --angle: 0deg;
    }
    to {
      --angle: 360deg;
    }
  }
`;

const TestPage: React.FC = () => {
  return (
    <Wrapper
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Left></Left>
      <Right>
        <Container>
          <Cover>
            <h2>Log In</h2>
          </Cover>
        </Container>
      </Right>
    </Wrapper>
  );
};

export default TestPage;
