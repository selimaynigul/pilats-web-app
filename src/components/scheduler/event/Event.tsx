import React, { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { capitalize, hasRole } from "utils/permissionUtils";
import { usePopover } from "contexts/PopoverProvider";

const Container = styled.div.withConfig({
  shouldForwardProp: (prop) => !["bgColor", "darkColor"].includes(prop),
})<{ bgColor: string; darkColor: string }>`
  background: ${(props) => props.bgColor};
  border-bottom: 4px solid ${(props) => props.darkColor};
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  transition: 0.1s;
  width: 100%;
  height: 100%;

  &:hover {
    background: ${(props) => props.darkColor};
  }

  @media (max-width: 1024px) {
    padding: 1px 2px;
    border-radius: 3px;
    border: none;

    strong {
      font-size: 0.8rem;
      font-weight: 200;
    }
  }

  @media (min-width: 1025px) {
    strong {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const CustomEvent: React.FC<{
  event: any;
  onOpenDrawer: (ev: any) => void;
  dayEvents: any[];
  refresh: () => any;
  showTime?: boolean;
  ismobile?: boolean;
}> = ({ event, dayEvents, refresh, showTime, onOpenDrawer }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [isDragging, setIsDragging] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { setOpenId } = usePopover();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(false);
  };

  const handleMouseMove = () => {
    setIsDragging(true);
  };

  const handleDoubleClick = () => {
    if (!isDragging) {
      setOpenId(null);
      setSearchParams({ id: event.id });
    }
  };

  // 32 different colors
  const colorPalette = [
    "#5d46e5",
    "#2980b9",
    "#619c86",
    "#6f7597",
    "#afa8ba",
    "#67baa7",
    "#A9B49D",
    "#f56882",
    "#74b2df",
    "#8263ff",
    "#567b97",
    "#1abc9c",
    "#00a2b7",
    "#b4a3d8",
    "#007db7",
    "#96bbfc",
    "#b2a8b8",
    "#789CA2",
    "#5079b5",
    "#00a981",
    "#567690",
    "#9ab5bc",
    "#9e8dc1",
    "#0b879d",
    "#a681ff",
    "#209585",
    "#7FA7C5",
  ];

  function getColorForCompany(
    companyName: any,
    companyId: any,
    testMode = false
  ) {
    let index;

    if (testMode) {
      index = Math.floor(Math.random() * colorPalette.length);
    } else if (hasRole(["ADMIN", "COMPANY_ADMIN"])) {
      const input = `${companyName}_${companyId}`;
      let hash = 0;
      for (let i = 0; i < input.length; i++) {
        hash = input.charCodeAt(i) + ((hash << 5) - hash);
      }
      index = Math.abs(hash) % colorPalette.length;
    } else {
      index = 0;
    }

    return colorPalette[index];
  }

  function darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;

    return (
      "#" +
      (
        0x1000000 +
        (Math.max(0, R) << 16) +
        (Math.max(0, G) << 8) +
        Math.max(0, B)
      )
        .toString(16)
        .slice(1)
    );
  }

  const hashName = hasRole(["COMPANY_ADMIN"])
    ? event.branchName
    : event.companyName;
  const hashId = hasRole(["COMPANY_ADMIN"]) ? event.branchId : event.companyId;
  const bgColor = getColorForCompany(hashName, hashId);
  const darkColor = darkenColor(bgColor, 10);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Container
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleDoubleClick}
        bgColor={bgColor}
        darkColor={darkColor}
      >
        <strong>{capitalize((event as any)?.name)}</strong>
        {!isMobile && showTime && (
          <small
            style={{
              opacity: 0.8,
              fontSize: 10,
              display: "block",
              marginTop: 2,
            }}
          >
            {dayjs(event.start).format("HH:mm")} -{" "}
            {dayjs(event.end).format("HH:mm")}
          </small>
        )}
      </Container>
    </div>
  );
};

export default CustomEvent;
