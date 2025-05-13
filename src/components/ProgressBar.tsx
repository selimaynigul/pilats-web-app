import React from "react";
import styled from "styled-components";
import { Progress } from "antd";

interface RoundedProgressBarProps {
  total: number;
  current: number;
  height?: number;
  color?: string;
  showText?: boolean;
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const StyledProgress = styled(Progress)<{ $height: number }>`
  .ant-progress-inner {
    border-radius: 8px;
    background-color: #ddd;
    overflow: hidden;
    height: ${(props) => props.$height}px;
  }

  .ant-progress-bg {
    border-radius: 8px;
    height: ${(props) => props.$height}px !important;
  }
`;

const CenteredText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 500;
  color: #333;
  font-size: 12px;
  white-space: nowrap;
`;

const ProgressBar: React.FC<RoundedProgressBarProps> = ({
  total,
  current,
  height = 14,
  color = "#4f46e5",
  showText = false,
}) => {
  const percent = total > 0 ? (current / total) * 100 : 0;

  return (
    <Wrapper>
      <StyledProgress
        percent={percent}
        strokeColor={color}
        trailColor="#E6E3FF"
        showInfo={false}
        $height={height}
      />
      {showText && (
        <CenteredText>
          {current}/{total}
        </CenteredText>
      )}
    </Wrapper>
  );
};

export default ProgressBar;
