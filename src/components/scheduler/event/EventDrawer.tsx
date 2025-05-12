import React, { useState } from "react";
import { Drawer, Avatar, Button, Input, Progress } from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditFilled,
  ArrowRightOutlined,
  UserOutlined,
  PlusOutlined,
  AntDesignOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { hasRole } from "utils/permissionUtils";
import { useLanguage } from "hooks";
import { Collapse } from "antd";
import { MdPersonAddAlt1 } from "react-icons/md";

import "dayjs/locale/tr";
const { Panel } = Collapse;
dayjs.locale("tr");

dayjs.extend(isSameOrAfter);

const event = {
  name: "Yoga Class",
  description: "Yeni başlayanlar için 5 haftalık yoga dersi.",
  trainerId: 1,
  trainerName: "Ayşe",
  trainerSurname: "Yılmaz",
  start: "2025-05-12T10:00:00",
  end: "2025-03-12T11:00:00",
  capacity: 15,
  company: {
    id: 101,
    name: "FitLife Holding",
  },
  branch: {
    id: 205,
    name: "Ataşehir Şubesi",
  },

  attendees: [
    {
      id: 1,
      firstName: "Ali",
      lastName: "Kaya",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=AliKaya",
    },
    {
      id: 2,
      firstName: "Zeynep",
      lastName: "Demir",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=ZeynepDemir",
    },
    {
      id: 3,
      firstName: "Mehmet",
      lastName: "Çelik",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=MehmetCelik",
    },
    /*  {
      id: 4,
      firstName: "Ayşe",
      lastName: "Yılmaz",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=AyseYilmaz",
    },
    {
      id: 5,
      firstName: "Burak",
      lastName: "Aydın",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=BurakAydin",
    },
    {
      id: 6,
      firstName: "Elif",
      lastName: "Koç",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=ElifKoc",
    },
    {
      id: 7,
      firstName: "Mert",
      lastName: "Erdoğan",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=MertErdogan",
    },
    {
      id: 8,
      firstName: "Nazlı",
      lastName: "Kurt",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=NazliKurt",
    },
    {
      id: 9,
      firstName: "Emre",
      lastName: "Şahin",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=EmreSahin",
    },
    {
      id: 10,
      firstName: "Selin",
      lastName: "Aslan",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=SelinAslan",
    }, */
  ],
};

const EventDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ open, onClose, onEdit, onDelete }) => {
  const { t } = useLanguage();

  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [attendees, setAttendees] = useState(event.attendees);

  const showAttendance = dayjs().isAfter(dayjs(event.end));
  const getAttendanceStatus = (userId: number) =>
    userId % 2 === 0 ? "Katıldı" : "Katılmadı"; // demo amaçlı

  return (
    <StyledDrawer
      title={event.name}
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      bodyStyle={{ padding: 20 }}
      extra={
        hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"]) && (
          <ActionButtonGroup>
            {dayjs(event.start).isSameOrAfter(dayjs(), "day") && (
              <SquareButton icon={<EditFilled />} onClick={onEdit} />
            )}
            <SquareButton icon={<DeleteOutlined />} danger onClick={onDelete} />
          </ActionButtonGroup>
        )
      }
    >
      <Wrapper>
        <Paragraph>{event.description}</Paragraph>
        <InfoBar>
          <DateTimeBox>
            <CalendarOutlined />
            <small>{dayjs(event.start).format("D MMMM YYYY")}</small>
          </DateTimeBox>
          <DateTimeBox>
            <ClockCircleOutlined />
            <small>
              {dayjs(event.start).format("HH:mm")} -{" "}
              {dayjs(event.end).format("HH:mm")}
            </small>
          </DateTimeBox>
        </InfoBar>
        <Link to={`/companies/${event.company.id}/branches/${event.branch.id}`}>
          <InfoBoxRow>
            <TrainerAvatar>
              <AntDesignOutlined />
            </TrainerAvatar>
            <TrainerInfo>
              <strong>{event.company.name}</strong>
              <small>{event.branch.name}</small>
            </TrainerInfo>
            <ArrowRightOutlined style={{ color: "gray" }} />
          </InfoBoxRow>
        </Link>
        <Link to={`/trainers/${event.trainerId}`}>
          <TrainerBox>
            <TrainerAvatar>
              <UserOutlined />
            </TrainerAvatar>
            <TrainerInfo>
              <strong>
                {event.trainerName} {event.trainerSurname}
              </strong>
              <small>Expert Yoga Trainer</small>
            </TrainerInfo>
            <ArrowRightOutlined style={{ color: "gray" }} />
          </TrainerBox>
        </Link>
        <Collapse
          ghost
          expandIconPosition="end"
          style={{ background: "transparent" }}
        >
          <Panel
            key="attendees"
            header={<SectionTitle>{t.attendees}</SectionTitle>}
          >
            <StickyAttendeeHeader>
              {!showSearch ? (
                <AttendeeHeader>
                  <ProgressWrapper>
                    <RoundedProgress
                      percent={(attendees.length / event.capacity) * 100}
                      strokeWidth={40}
                      strokeColor="#7e97f2"
                      trailColor="#ddd"
                      showInfo={false}
                    />
                    <CenteredText>
                      <strong>
                        {" "}
                        {attendees.length}/{event.capacity}{" "}
                      </strong>
                      attendees
                    </CenteredText>
                  </ProgressWrapper>

                  <FullWidthButton
                    icon={<MdPersonAddAlt1 />}
                    disabled={attendees.length >= event.capacity}
                    onClick={() => setShowSearch(true)}
                  />
                </AttendeeHeader>
              ) : (
                <Input.Search
                  autoFocus
                  placeholder="Kullanıcı ara..."
                  allowClear
                  enterButton="Ara"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onBlur={() => setShowSearch(false)}
                  onSearch={(value) => {
                    const newUser = {
                      id: Date.now(),
                      firstName: value,
                      lastName: "Eklenen",
                      avatar:
                        "https://api.dicebear.com/7.x/miniavs/svg?seed=" +
                        value,
                    };
                    setAttendees([...attendees, newUser]);
                    setShowSearch(false);
                    setSearchValue("");
                  }}
                  style={{ marginBottom: 12 }}
                />
              )}
            </StickyAttendeeHeader>

            <AttendeeList>
              {attendees.map((user: any) => (
                <AttendeeRow key={user.id}>
                  <AttendeeInfo>
                    <Avatar size={40} src={user.avatar} />
                    <div>
                      <AttendeeName>
                        {user.firstName} {user.lastName}
                      </AttendeeName>
                      {showAttendance && (
                        <AttendanceStatus $present={user.id % 2 === 0}>
                          {getAttendanceStatus(user.id)}
                        </AttendanceStatus>
                      )}
                    </div>
                  </AttendeeInfo>
                  <DeleteButton
                    onClick={() =>
                      setAttendees((prev) =>
                        prev.filter((att: any) => att.id !== user.id)
                      )
                    }
                  />
                </AttendeeRow>
              ))}
            </AttendeeList>
          </Panel>
        </Collapse>
      </Wrapper>
    </StyledDrawer>
  );
};

export default EventDrawer;

const StyledDrawer = styled(Drawer)``;

const RoundedProgress = styled(Progress)`
  .ant-progress-bg {
    border-radius: 15px;
  }

  .ant-progress-inner {
    border-radius: 15px;
    background-color: #ddd;
  }
`;

const ProgressWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 40px; /* butonla aynı yükseklik */
`;

const CenteredText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 500;
  color: black;
  font-size: 12px;
`;
const StickyAttendeeHeader = styled.div`
  position: sticky;
  top: -21px;
  z-index: 10;
  background: white;
  padding-bottom: 8px;
  margin-bottom: 8px;
  padding-top: 10px;
`;

const InfoBar = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const DateTimeBox = styled.div`
  flex: 1;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const SquareButton = styled(Button)`
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FullWidthButton = styled(Button)`
  min-width: 40px;
  height: 40px;
  border-radius: 15px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.primary};
  font-size: 16px;
  color: white;
  border: none;
`;

const AttendeeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AttendanceStatus = styled.small<{ $present: boolean }>`
  color: ${(props) => (props.$present ? "green" : "red")};
  font-size: 12px;
  margin-top: 2px;
  display: block;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  .ant-collapse-content > .ant-collapse-content-box,
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding: 10px 0;
  }

  .ant-collapse-ghost
    > .ant-collapse-item
    > .ant-collapse-content
    > .ant-collapse-content-box {
    padding-block: 0px;
  }
`;

const InfoBoxRow = styled.div`
  display: flex;
  align-items: center;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 10px;
  gap: 10px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`;

const SectionTitle = styled.strong`
  font-size: 14px;
  color: #444;
`;

const Paragraph = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  margin-bottom: 10px;
`;

const TrainerBox = styled.div`
  display: flex;
  align-items: center;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 10px;
  gap: 10px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f0f0f0;
  }
`;

const TrainerAvatar = styled.div`
  background: #999;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const TrainerInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
`;

const AttendeeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const AttendeeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
  background: #f9f9f9;

  &:hover {
    background: #f0f0f0;
  }
`;

const AttendeeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AttendeeName = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: #333;
`;

const DeleteButton = styled(DeleteOutlined)`
  color: #ff4d4f;
  font-size: 16px;

  &:hover {
    color: #d9363e;
  }
`;
