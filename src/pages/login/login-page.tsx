import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 500px;
  width: 800px;
  border-radius: 20px;
  position: relative;
  background: white;
`;

const LoginPage: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "lightgray",
      }}
    >
      <Container></Container>
    </div>
  );
};

export default LoginPage;
