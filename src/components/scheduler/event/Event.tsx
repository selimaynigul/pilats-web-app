import React, { useEffect, useState } from "react";
import { message } from "antd";
import styled from "styled-components";
import dayjs from "dayjs";
import { sessionService } from "services";
import EditSessionForm from "../edit-session-form/edit-session-form";
import { StyledModal } from "../SchedulerStyles";
import EventPopover from "./EventPopover";

const Container = styled.div`
  background: #5d46e5;
  border-bottom: 5px solid #4d3abd;
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
`;

const CustomEvent: React.FC<{
  event: any;
  dayEvents: any[];
  fetch: () => any;
  highlightedEventId?: any;
  showTime?: boolean;
  ismobile?: boolean;
}> = ({ event, dayEvents, fetch, highlightedEventId, showTime }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

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
          className={event.id == highlightedEventId ? "highlighted-event" : ""}
        >
          <strong
            style={{
              display: "block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {(event as any)?.name}
          </strong>
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
    </div>
  );
};

export default CustomEvent;
