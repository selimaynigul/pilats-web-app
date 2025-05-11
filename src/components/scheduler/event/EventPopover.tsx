import React from "react";
import { Avatar, Tooltip, Button, Popover } from "antd";
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
import { Link } from "react-router-dom";
import { hasRole } from "utils/permissionUtils";
import { useLanguage } from "hooks";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

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
    box-shadow: rgba(149, 157, 165, 0.4) 0px 8px 12px;
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
    box-shadow: rgba(255, 50, 94, 0.2) 0px 8px 12px;
  }
`;

const AttendeeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

interface EventPopoverProps {
  event: any;
  handleEditClick: () => void;
  handleDelete: () => void;
  children: any;
  visible: boolean;
  setVisible: any;
}

const EventPopover: React.FC<EventPopoverProps> = ({
  event,
  handleEditClick,
  handleDelete,
  children,
  visible,
  setVisible,
}) => {
  const { t } = useLanguage();

  const content = (
    <div style={{ position: "relative", maxWidth: 300 }}>
      <div style={{ marginBottom: 20 }}>
        <strong>{event.name}</strong>
        {hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"]) && (
          <ActionButtons>
            {/* Edit sadece bugünkü ve sonraki etkinliklerde gösterilsin */}
            {dayjs(event.start).isSameOrAfter(dayjs(), "day") && (
              <EditButton type="primary" onClick={handleEditClick}>
                <EditFilled />
              </EditButton>
            )}

            {/* Delete her zaman gösterilsin */}
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
      <strong style={{ display: "block", marginTop: 15 }}>
        {t.description}
      </strong>
      <small>{event.description}</small>

      <strong style={{ display: "block", marginTop: 15 }}>{t.trainer}</strong>
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
        <strong style={{ display: "block", marginTop: 15 }}>
          {t.attendees}
        </strong>
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

  return (
    <Popover
      open={visible}
      onOpenChange={setVisible}
      trigger="click"
      content={content}
      arrow={false}
    >
      {children}
    </Popover>
  );
};

export default EventPopover;
