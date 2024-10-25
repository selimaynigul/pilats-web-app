import React from "react";
import styled from "styled-components";
import { Popover, Avatar, Tooltip, Button } from "antd";
import {
  AntDesignOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditFilled,
  UserOutlined,
} from "@ant-design/icons";
import { MyEvent } from "./Scheduler";

const Container = styled.div<{ more?: boolean }>`
  background: #5d46e5;
  border-bottom: 5px solid #4d3abd;
  color: white;
  padding: 10px;
  border-radius: ${(props) => (props.more ? "0 15px 15px 15px" : "15px")};
  cursor: pointer;
  position: relative;
  height: 75px;
  box-sizing: border-box;

  &:hover {
    background: #4d3abd;
  }
`;
const TranierInfo = styled.div`
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
const TranierPhoto = styled.div`
  background: grey;
  height: 40px;
  width: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;
const TranierName = styled.div`
  display: flex;
  flex-direction: column;
`;
const TranierDetailButton = styled.div`
  background: transparent;
  height: 30px;
  width: 30px;
  border-radius: 10px;
  opacity: 0;
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
  /* color: #5d46e5; */
  color: gray;
`;

const MoreButton = styled.div`
  border: 1px solid #412bc4;
  color: #412bc4;
  border-radius: 10px 10px 0 0;
  padding: 1px 5px 10px 5px;
  cursor: pointer;
  position: absolute;
  bottom: 65px;
  left: 5px;
  width: fit-content;
  transition: 0.1s;

  &:hover {
    bottom: 67px;
  }
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

interface CustomEventProps {
  event: MyEvent;
}

const content = (
  <div style={{ position: "relative", maxWidth: 300 }}>
    <div style={{ marginBottom: 20 }}>
      <strong>Yoga Dersi</strong>
      <ActionButtons>
        <EditButton type="primary">
          <EditFilled />
        </EditButton>
        <DeleteButton type="primary">
          <DeleteOutlined />
        </DeleteButton>
      </ActionButtons>
    </div>
    <div style={{ display: "flex", gap: 5 }}>
      <DateInfo>
        <CalendarOutlined style={{ color: "grey  " }} />
        <strong style={{ display: "block" }}>
          <small>14 Ekim 2024</small>
        </strong>
      </DateInfo>
      <DateInfo>
        <ClockCircleOutlined style={{ color: "grey  " }} />
        <strong style={{ display: "block" }}>
          <small>09.00-17.00</small>
        </strong>
      </DateInfo>
    </div>

    <strong style={{ display: "block", marginTop: 15 }}>Açıklama</strong>
    <small>
      Lorem ismallsum dolor, sit amet consectetur adipisicing elit. Officiis,
      eius. Ratione dolorem rerum beatae, recusandae voluptatem eaque maiores
      veniam.
    </small>

    <strong style={{ display: "block", marginTop: 15 }}>Eğitmen</strong>
    <div style={{ marginTop: 0 }}>
      <TranierInfo>
        <TranierPhoto>
          <UserOutlined style={{ fontSize: 20 }} />
        </TranierPhoto>
        <TranierName>
          <strong>Ahmet Yiğit</strong>
          <small> Uzman Yoga Eğitmeni</small>
        </TranierName>
        <TranierDetailButton>
          <ArrowRightOutlined />
        </TranierDetailButton>
      </TranierInfo>
      <strong style={{ display: "block", marginTop: 15 }}>Katılımcılar</strong>
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
const moreContent = <div>elma</div>;

const CustomEvent: React.FC<CustomEventProps> = ({ event }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Set the event ID in the dataTransfer object for drop handling
    e.dataTransfer.setData("eventId", event.id?.toString() || "");
  };

  const more = true;

  return (
    <div style={{ position: "relative" }}>
      {more && (
        <Popover
          trigger="click"
          content={moreContent}
          title={event.title}
          arrow={false}
        >
          <MoreButton>+2 daha</MoreButton>
        </Popover>
      )}
      <Popover trigger="click" content={content} arrow={false}>
        <div style={{ margin: 5 }} draggable onDragStart={handleDragStart}>
          <Container more={more}>
            <strong style={{ display: "block" }}>{event.title}</strong>

            <small>
              {event.start.toLocaleTimeString()} -{" "}
              {event.end.toLocaleTimeString()}
            </small>
          </Container>
        </div>
      </Popover>
    </div>
  );
};

export default CustomEvent;
