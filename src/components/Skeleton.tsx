import React, { useState } from "react";
import { Skeleton } from "antd";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  gap: 20px;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const LoadingSkeleton: React.FC = () => {
  return (
    <Wrapper>
      <Container>
        <Skeleton.Node
          active={true}
          style={{ borderRadius: 20, width: 280, height: 220 }}
        />
        <Skeleton.Node
          active={true}
          style={{ borderRadius: 20, width: 280, height: 220 }}
        />
        <Skeleton.Node
          active={true}
          style={{ borderRadius: 20, width: 280, height: 220 }}
        />
        <Skeleton.Node
          active={true}
          style={{ borderRadius: 20, width: 280, height: 220 }}
        />
      </Container>
      <Container>
        <Skeleton.Node
          active={true}
          style={{ borderRadius: 20, width: 280, height: 220 }}
        />
        <Skeleton.Node
          active={true}
          style={{ borderRadius: 20, width: 280, height: 220 }}
        />
        <Skeleton.Node
          active={true}
          style={{ borderRadius: 20, width: 280, height: 220 }}
        />
        <Skeleton.Node
          active={true}
          style={{ borderRadius: 20, width: 280, height: 220 }}
        />
      </Container>
    </Wrapper>
  );
};
export default LoadingSkeleton;
