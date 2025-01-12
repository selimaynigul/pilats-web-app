import React, { useState } from "react";
import { Popover, Avatar, Tooltip, Button, message, Modal } from "antd";
import {
  AntDesignOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditFilled,
  UserOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import dayjs from "dayjs";
import { sessionService } from "services";
import { Link } from "react-router-dom";
import { hasRole } from "utils/permissionUtils";
import EditSessionForm from "../edit-session-form/edit-session-form";
import { StyledModal } from "../SchedulerStyles";
import EventPopover from "./EventPopover";

const Container = styled.div<{ more?: boolean }>`
  background: #5d46e5;
  border-bottom: 5px solid #4d3abd;
  color: white;
  padding: 10px;
  border-radius: ${(props) => (props.more ? "0 15px 15px 15px" : "15px")};
  border-radius: 15px;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  transition: 0.1s;

  &:hover {
    background: #4d3abd;
  }
`;

const CustomEvent: React.FC<{
  event: any;
  dayEvents: any[];
  fetch: () => any;
  highlightedEventId?: any;
}> = ({ event, dayEvents, fetch, highlightedEventId }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);

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

  const more = dayEvents.length > 1;
  const moreEventsCount = dayEvents.length - 1;
  return (
    <div style={{ position: "relative" }}>
      <EventPopover
        event={event}
        handleEditClick={handleEditClick}
        handleDelete={handleDelete}
        visible={popoverVisible}
        setVisible={setPopoverVisible}
      >
        <div>
          <Container
            className={
              event.id == highlightedEventId ? "highlighted-event" : ""
            }
            more={more}
          >
            <strong style={{ display: "block" }}>{(event as any)?.name}</strong>
            {moreEventsCount === 0 && (
              <small>
                {dayjs(event.start).format("HH:mm")} -{" "}
                {dayjs(event.end).format("HH:mm")}
              </small>
            )}
          </Container>
        </div>
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
