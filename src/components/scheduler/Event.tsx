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
import EditSessionForm from "./edit-session-form/edit-session-form";
import { StyledModal } from "./SchedulerStyles";

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

const TrainerInfo = styled.div`
  border: 1px solid white;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 12px;
  width: 100%;
  border-radius: 10px;
  margin: 7px 0 15px 0;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  background: transparent;
  align-items: center;
  transition: all 0.1s ease;
  gap: 10px;
  cursor: pointer;

  &:hover {
    div:nth-of-type(3) {
      opacity: 1;
    }

    box-shadow: rgba(149, 157, 165, 0.4) 0px 8px 24px;
  }
`;

const DateInfo = styled.div`
  background: transparent;
  width: fit-content;
  border-radius: 10px;
  padding: 5px 15px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 12px;
`;

const TrainerPhoto = styled.div`
  background: grey;
  height: 40px;
  width: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const TrainerName = styled.div`
  display: flex;
  flex-direction: column;
`;

const TrainerDetailButton = styled.div`
  background: transparent;
  height: 30px;
  width: 30px;
  border-radius: 10px;
  opacity: 0;
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
  color: gray;
`;

const ActionButtons = styled.div`
  position: absolute;
  display: flex;
  gap: 5px;
  top: 0px;
  right: 5px;
`;

const EditButton = styled(Button)`
  border-radius: 10px;
  background: transparent;
  border: 1px solid white;
  width: 30px;
  height: 30px;
  color: grey;
  box-shadow: none;
  &:hover {
    background: transparent !important;
    color: grey !important;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 12px;
  }
`;

const DeleteButton = styled(Button)`
  border-radius: 10px;
  background: transparent;
  border: 1px solid #f54263;
  width: 30px;
  height: 30px;
  color: #f54263;
  box-shadow: none;
  &:hover {
    background: #f54263 !important;
    color: white !important;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 12px;
  }
`;

const AttendeeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    setPopoverVisible(false); // Close the popover
  };

  const content = (
    <div style={{ position: "relative", maxWidth: 300 }}>
      <div style={{ marginBottom: 20 }}>
        <strong>{event.name}</strong>
        {hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"]) && (
          <ActionButtons>
            <EditButton type="primary" onClick={handleEditClick}>
              <EditFilled />
            </EditButton>
            <DeleteButton onClick={handleDelete} type="primary">
              <DeleteOutlined />
            </DeleteButton>
          </ActionButtons>
        )}
      </div>
      <div style={{ display: "flex", gap: 5 }}>
        <DateInfo>
          <CalendarOutlined style={{ color: "grey  " }} />
          <strong style={{ display: "block" }}>
            <small>{dayjs(event.start).format("DD.MM.YYYY")}</small>
          </strong>
        </DateInfo>
        <DateInfo>
          <ClockCircleOutlined style={{ color: "grey  " }} />
          <strong style={{ display: "block" }}>
            <small>
              {dayjs(event.start).format("HH:mm")} -{" "}
              {dayjs(event.end).format("HH:mm")}
            </small>{" "}
          </strong>
        </DateInfo>
      </div>
      <strong style={{ display: "block", marginTop: 15 }}>Description</strong>
      <small>{event.description}</small>

      <strong style={{ display: "block", marginTop: 15 }}>Trainer</strong>
      <div style={{ marginTop: 0 }}>
        <Link to={`/trainers/${event.trainerId}`}>
          <TrainerInfo>
            <TrainerPhoto>
              <UserOutlined style={{ fontSize: 20 }} />
            </TrainerPhoto>
            <TrainerName>
              <strong>
                {event.trainerName} {event.trainerSurname}{" "}
              </strong>
              <small> Expert Yoga Trainer</small>
            </TrainerName>
            <TrainerDetailButton>
              <ArrowRightOutlined />
            </TrainerDetailButton>
          </TrainerInfo>
        </Link>
        <strong style={{ display: "block", marginTop: 15 }}>Attendees</strong>
        <AttendeeInfo>
          <Avatar.Group
            style={{ marginTop: 7 }}
            max={{
              count: 3,
              style: { color: "#f56a00", backgroundColor: "#fde3cf" },
            }}
          >
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=2" />
            <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
            <Tooltip title="Ant User" placement="top">
              <Avatar
                style={{ backgroundColor: "#87d068" }}
                icon={<UserOutlined />}
              />
            </Tooltip>
            <Avatar
              style={{ backgroundColor: "#1677ff" }}
              icon={<AntDesignOutlined />}
            />
          </Avatar.Group>

          <strong>12/15</strong>
        </AttendeeInfo>
      </div>
    </div>
  );

  const more = dayEvents.length > 1; // Example: Adjust if more events should show "+More" button
  const moreEventsCount = dayEvents.length - 1; // Number of additional events
  return (
    <div style={{ position: "relative" }}>
      <Popover
        trigger="click"
        content={content}
        visible={popoverVisible}
        onVisibleChange={setPopoverVisible}
        arrow={false}
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
      </Popover>

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
