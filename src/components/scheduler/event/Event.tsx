import React, { useEffect, useState } from "react";
import { message } from "antd";
import styled from "styled-components";
import dayjs from "dayjs";
import { sessionService } from "services";
import EditSessionForm from "../edit-session-form/edit-session-form";
import { StyledModal } from "../SchedulerStyles";
import { useLocation, useNavigate } from "react-router-dom";
import EventPopover from "./EventPopover";
import EventDrawer from "./EventDrawer";
import { capitalize } from "utils/permissionUtils";

const Container = styled.div`
  background: #5d46e5;
  border-bottom: 4px solid #4d3abd;
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
    background: #4d3abd;
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
  dayEvents: any[];
  fetch: () => any;
  showTime?: boolean;
  ismobile?: boolean;
}> = ({ event, dayEvents, fetch, showTime }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const sessionIdInQuery = searchParams.get("id");

  const [isDrawerVisible, setIsDrawerVisible] = useState(
    sessionIdInQuery === String(event.id)
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDelete = () => {
    sessionService
      .delete(event.id)
      .then(() => {
        fetch();
        message.success("Deleted successfully!");
      })
      .catch((error) => {
        message.error("Failed to delete the event.");
      });
  };

  const handleEditClick = () => {
    setIsEditModalVisible(true);
    setPopoverVisible(false);
  };

  const openDrawer = () => {
    const params = new URLSearchParams(location.search);
    params.set("id", event.id);
    navigate({ search: params.toString() }, { replace: true });
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    const params = new URLSearchParams(location.search);
    params.delete("id");
    navigate({ search: params.toString() }, { replace: true });
    setIsDrawerVisible(false);
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(false);
  };

  const handleMouseMove = () => {
    setIsDragging(true);
  };

  const handleDoubleClick = () => {
    if (!isDragging) {
      openDrawer();
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <EventPopover
        event={event}
        handleEditClick={handleEditClick}
        handleDelete={handleDelete}
        visible={popoverVisible}
        setVisible={setPopoverVisible}
      >
        <Container
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onDoubleClick={handleDoubleClick}
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
      </EventPopover>

      {/* Edit Session Modal */}
      <StyledModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <EditSessionForm
          session={event}
          onClose={() => setIsEditModalVisible(false)}
          onUpdated={fetch}
        />
      </StyledModal>

      <EventDrawer
        open={isDrawerVisible}
        onClose={closeDrawer}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CustomEvent;
