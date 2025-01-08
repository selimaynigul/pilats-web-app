import { Button, Result } from "antd";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div``;

const UnauthorizedPage: React.FC = () => {
  return (
    <Container>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        /*   extra={<Button type="primary">Back Home</Button>} */
      />
    </Container>
  );
};
export default UnauthorizedPage;
