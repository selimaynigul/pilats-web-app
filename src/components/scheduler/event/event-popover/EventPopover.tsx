import React, { useEffect, useRef, useState } from "react";
import { Avatar, Tooltip, Button, Popover } from "antd";
import {
  ArrowRightOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditFilled,
  UserOutlined,
} from "@ant-design/icons";
import { FiMoreVertical } from "react-icons/fi";
import styled from "styled-components";
import { useTheme } from "contexts/ThemeProvider";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { capitalize, hasRole } from "utils/permissionUtils";
import { useLanguage } from "hooks";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { sessionService } from "services";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { usePopover } from "contexts/PopoverProvider";

dayjs.extend(isSameOrAfter);

const Header = styled.div`
  height: 30px;
  margin-bottom: 10px;
  transition: all 0.2s ease;
  cursor: pointer;
  border-radius: 10px;
`;

const TrainerInfo = styled.div`
  width: 100%;
  border-radius: 10px;
  margin: 7px 0 15px 0;
  padding: 5px;
  box-sizing: border-box;
  display: flex;
  background: ${({ theme }) => theme.contentBg};
  border: 1px solid transparent;
  align-items: center;
  transition: all 0.1s ease;
  gap: 10px;
  cursor: pointer;

  &:hover {
    div:nth-of-type(3) {
      opacity: 1;
    }

    border: 1px solid ${({ theme }) => theme.bodyBg};
  }
`;

const DateInfo = styled.div`
  background: ${({ theme }) => theme.contentBg};
  width: fit-content;
  border-radius: 10px;
  padding: 5px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const TrainerPhoto = styled.div`
  background: ${({ theme }) => theme.avatarBg};
  height: 40px;
  width: 40px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const TrainerName = styled.div`
  display: flex;
  flex-direction: column;

  strong,
  small {
    color: ${({ theme }) => theme.text};
  }
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
  right: 0px;
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
const DetailButton = styled(Button)`
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 4px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: grey;
  transition: 0.3s;
  border: 1px solid transparent !important;
  border-radius: 10px;

  &:hover {
    background: rgb(255, 255, 255, 0.5) !important;
    border: 1px solid white !important;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 12px !important;
    color: grey !important;
  }
`;
const AttendeeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 7px;
  color: ${({ theme }) => theme.text};
`;

const StyledAvatar = styled(Avatar)`
  &:hover {
    z-index: 9;
  }
`;

interface EventPopoverProps {
  event: any;
  handleEditClick: (ev: any) => void;
  handleDelete: (ev: any) => void;
  children: any;
}

const EventPopover: React.FC<EventPopoverProps> = ({
  event,
  handleEditClick,
  handleDelete,
  children,
  ...rest
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Katılımcı state'i
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const { openId, setOpenId, triggerRef } = usePopover();

  const selfRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const isOpen = openId === event.id && triggerRef.current === selfRef.current;

  useEffect(() => {
    if (isOpen && event?.id) {
      setLoadingAttendees(true);
      sessionService
        .getSessionCustomers({
          searchByPageDto: {
            sort: "DESC",
            pageNo: 0,
            pageSize: 100,
          },
          sessionId: event.id,
          sessionCustomerEventsList: ["JOINED", "ATTENDED"],
        })
        .then((res: any) => {
          setAttendees(res?.data || []);
        })
        .catch(() => setAttendees([]))
        .finally(() => setLoadingAttendees(false));
    }
  }, [openId, event?.id]);

  const avatarColorPairs = [
    { bg: "#ffe7ba", color: "#873800" },
    { bg: "#b5f5ec", color: "#00474f" },
    { bg: "#ffccc7", color: "#820014" },
    { bg: "#bae0ff", color: "#002c8c" },
    { bg: "#d9f7be", color: "#135200" },
  ];

  const goToSession = () => {
    setOpenId(null);
    navigate(`/sessions/?id=${event.id}`);
  };

  const content = (
    <div style={{ position: "relative", maxWidth: 300 }}>
      <Header onClick={goToSession}>
        <strong
          style={{
            color: theme.text,
            display: "block",
            maxWidth: 140,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            paddingTop: 3,
          }}
          title={capitalize(event.name)}
        >
          {capitalize(event.name)}
        </strong>
        <ActionButtons>
          {dayjs(event.start).isSameOrAfter(dayjs(), "minute") &&
            hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"]) && (
              <EditButton
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenId(null);
                  handleEditClick(event);
                }}
              >
                <EditFilled />
              </EditButton>
            )}

          {/* Delete her zaman gösterilsin */}
          {hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"]) && (
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                setOpenId(null);
                handleDelete(event);
              }}
              type="primary"
            >
              <DeleteOutlined />
            </DeleteButton>
          )}
          <Tooltip title={t.detail || "Dersi görüntüle"}>
            <DetailButton onClick={goToSession} type="primary">
              <FiMoreVertical />
            </DetailButton>
          </Tooltip>
        </ActionButtons>
      </Header>
      {event.description && (
        <small style={{ color: theme.text }}>
          {event.description ? event.description : t.noDescription}
        </small>
      )}
      <div style={{ marginTop: 15, display: "flex", gap: 5 }}>
        <DateInfo>
          <CalendarOutlined style={{ color: theme.title }} />
          <strong style={{ color: theme.text, display: "block" }}>
            <small>{dayjs(event.start).format("DD.MM.YYYY")}</small>
          </strong>
        </DateInfo>
        <DateInfo>
          <ClockCircleOutlined style={{ color: theme.title }} />
          <strong style={{ color: theme.text, display: "block" }}>
            <small>
              {dayjs(event.start).format("HH:mm")} -{" "}
              {dayjs(event.end).format("HH:mm")}
            </small>{" "}
          </strong>
        </DateInfo>
      </div>

      <strong style={{ color: theme.text, display: "block", marginTop: 10 }}>
        {t.trainer}
      </strong>

      <div style={{ marginTop: 0 }}>
        <Link to={`/trainers/${event.trainerId}`}>
          <TrainerInfo>
            <TrainerPhoto>
              {event.trainerImageUrl ? ( // TODO: gerçek resimle değişmeli backend döndürmeli
                <Avatar
                  src={event.trainerImageUrl}
                  size={40}
                  style={{ background: "transparent" }}
                  icon={<UserOutlined style={{ fontSize: 20 }} />}
                />
              ) : (
                <UserOutlined style={{ fontSize: 20 }} />
              )}
            </TrainerPhoto>
            <TrainerName>
              <strong>
                {event.trainerName} {event.trainerSurname}{" "}
              </strong>
              <small>
                {event.companyName} - {event.branchName}
              </small>
            </TrainerName>
            <TrainerDetailButton>
              <ArrowRightOutlined />
            </TrainerDetailButton>
          </TrainerInfo>
        </Link>
        <strong style={{ color: theme.text, display: "block", marginTop: 15 }}>
          {t.attendees}
        </strong>
        <AttendeeInfo>
          {loadingAttendees ? (
            <span>{t.loading}</span>
          ) : attendees.length === 0 ? (
            <small>{t.noAttendeesYet}</small>
          ) : (
            <Avatar.Group
              max={{
                count: 3,
                style: { color: "#f56a00", backgroundColor: "#fde3cf" },
              }}
            >
              {attendees.map((a, idx) => {
                const pair = avatarColorPairs[idx % avatarColorPairs.length];
                return (
                  <Link key={a.id} to={`/users/${a.id}`}>
                    <Tooltip
                      title={
                        `${a.ucGetResponse.name} ${a.ucGetResponse.surname}` ||
                        a.name
                      }
                      placement="top"
                    >
                      <div
                        style={{
                          border: `1px solid ${a.imageUrl ? "lightgrey" : "transparent"}`,
                          borderRadius: "50%",
                        }}
                      >
                        <StyledAvatar
                          src={
                            a.imageUrl
                              ? `https://uat-platesapi-latest.onrender.com/api/v1/images${a.imageUrl}`
                              : undefined
                          }
                          style={{
                            backgroundColor: a.imageUrl ? undefined : pair.bg,
                            color: a.imageUrl ? undefined : pair.color,
                          }}
                        >
                          {!a.imageUrl &&
                            `${(a.ucGetResponse.name || "?")[0] || ""}${(a.ucGetResponse.surname || "?")[0] || ""}`}
                        </StyledAvatar>
                      </div>
                    </Tooltip>
                  </Link>
                );
              })}
            </Avatar.Group>
          )}

          {event.remainingCapacity === 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#ff6b82",
                borderRadius: 50,
                padding: "2px 3px",
                fontWeight: 500,
                fontSize: 14,
                color: "#fff",
                minWidth: 90,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#ffabb8",
                  color: "#fff",
                }}
              >
                <ExclamationCircleFilled style={{ fontSize: 16 }} />
              </div>
              <span style={{ fontWeight: 700 }}>Full</span>
              <span style={{ color: "#fff", fontWeight: 400 }}>
                {event.totalCapacity}/{event.totalCapacity}
              </span>
            </div>
          ) : (
            <strong>
              {event.totalCapacity - event.remainingCapacity}/
              {event.totalCapacity}
            </strong>
          )}
        </AttendeeInfo>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      open={isOpen}
      onOpenChange={(v) => {
        if (!v && isOpen) setOpenId(null);
      }}
      trigger="click"
      arrow={false}
      getPopupContainer={() =>
        (document.querySelector(".rbc-overlay") as HTMLElement) || document.body
      }
      {...rest}
    >
      <div
        ref={selfRef}
        style={{ height: "100%" }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isOpen) {
            triggerRef.current = selfRef.current;
            setOpenId(event.id);
          }
        }}
      >
        {children}
      </div>
    </Popover>
  );
};

export default EventPopover;
