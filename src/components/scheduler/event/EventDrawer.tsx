import React from "react";
import { Drawer, Avatar, Tooltip, Button } from "antd";
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
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { hasRole } from "utils/permissionUtils";
import { useLanguage } from "hooks";

dayjs.extend(isSameOrAfter);

const EventDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  event: any;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ open, onClose, event, onEdit, onDelete }) => {
  const { t } = useLanguage();

  return (
    <Drawer
      title={event.name}
      placement="right"
      onClose={onClose}
      open={open}
      width={360}
    >
      <div style={{ position: "relative" }}>
        {hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"]) && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              display: "flex",
              gap: 5,
            }}
          >
            {dayjs(event.start).isSameOrAfter(dayjs(), "day") && (
              <Button onClick={onEdit} icon={<EditFilled />} />
            )}
            <Button danger onClick={onDelete} icon={<DeleteOutlined />} />
          </div>
        )}

        <div style={{ display: "flex", gap: 5, marginBottom: 15 }}>
          <InfoBox>
            <CalendarOutlined />
            <small>{dayjs(event.start).format("DD.MM.YYYY")}</small>
          </InfoBox>
          <InfoBox>
            <ClockCircleOutlined />
            <small>
              {dayjs(event.start).format("HH:mm")} -{" "}
              {dayjs(event.end).format("HH:mm")}
            </small>
          </InfoBox>
        </div>

        <strong>{t.description}</strong>
        <p>{event.description}</p>

        <strong>{t.trainer}</strong>
        <Link to={`/trainers/${event.trainerId}`}>
          <TrainerBox>
            <TrainerAvatar>
              <UserOutlined />
            </TrainerAvatar>
            <div>
              <strong>
                {event.trainerName} {event.trainerSurname}
              </strong>
              <small> Expert Yoga Trainer</small>
            </div>
            <ArrowRightOutlined style={{ marginLeft: "auto", color: "gray" }} />
          </TrainerBox>
        </Link>

        <strong>{t.attendees}</strong>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <Avatar.Group
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
        </div>
      </div>
    </Drawer>
  );
};

export default EventDrawer;

// Styled components
const InfoBox = styled.div`
  border: 1px solid #e0e0e0;
  padding: 5px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fafafa;
`;

const TrainerBox = styled.div`
  display: flex;
  align-items: center;
  background: #fafafa;
  padding: 10px;
  border-radius: 10px;
  margin-top: 8px;
  gap: 10px;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`;

const TrainerAvatar = styled.div`
  background: #999;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;
