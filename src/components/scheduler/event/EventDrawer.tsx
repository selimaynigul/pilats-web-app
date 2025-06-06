import React, { useEffect, useRef, useState } from "react";
import {
  Drawer,
  Avatar,
  Button,
  Input,
  Progress,
  message,
  Tooltip,
  Spin,
} from "antd";
import { FaCheck } from "react-icons/fa";

import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditFilled,
  ArrowRightOutlined,
  UserOutlined,
  AntDesignOutlined,
  CheckOutlined,
  CloseOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { hasRole } from "utils/permissionUtils";
import { useLanguage } from "hooks";
import { Collapse } from "antd";
import { MdPersonAddAlt1 } from "react-icons/md";
import { sessionService, userService } from "services";
import { useSearchParams } from "react-router-dom";
import "dayjs/locale/tr";
import EventStatusAlert from "./EventStatusAlert";
import { Dropdown, Menu } from "antd";
const { Panel } = Collapse;
dayjs.locale("tr");
dayjs.extend(isSameOrAfter);

const EventDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ open, onClose, onEdit, onDelete }) => {
  const [searchParams] = useSearchParams();
  const sessionId = parseInt(searchParams.get("id") || "0", 10);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(true);
  const [joining, setJoining] = useState(false);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  const [event, setEvent] = useState<any | null>(null);

  const { t } = useLanguage();

  const canAdd = event
    ? dayjs(event.start).isSameOrAfter(dayjs(), "minute")
    : false;

  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [searchValue, setSearchValue] = useState("");

  const showAttendance = dayjs().isAfter(dayjs(event?.start), "minute");

  useEffect(() => {
    if (!open || hasFetched.current) return;

    const fetchData = async () => {
      if (!sessionId) return;

      try {
        // 1. Etkinlik detayını çek
        const sessionRes: any = await sessionService.search({ id: sessionId });
        console.log("fetching session", sessionRes);
        const sessionData = sessionRes.data[0];
        setEvent({
          name: sessionData.name,
          description: sessionData?.description,
          trainerId: sessionData.trainerId,
          trainerName: sessionData.trainerName,
          trainerSurname: sessionData.trainerSurname,
          start: sessionData.startDate,
          end: sessionData.endDate,
          capacity: sessionData.totalCapacity,
          company: {
            id: sessionData.companyId,
            name: sessionData.companyName,
          },
          branch: {
            id: sessionData.branchId,
            name: sessionData.branchName,
          },
        });

        // 2. Katılımcıları çek
        const customerRes = await sessionService.getSessionCustomers({
          searchByPageDto: {
            sort: "DESC",
            pageNo: 0,
            pageSize: 100,
          },
          sessionId,
          sessionCustomerEventsList: ["JOINED", "ATTENDED"],
        });

        const attendees = customerRes.data.map((item: any) => ({
          id: item.customerId,
          firstName: item.ucGetResponse?.name,
          lastName: item.ucGetResponse?.surname,
          avatar: null,
          present: item.customerLastEvent === "ATTENDED",
        }));

        setAttendees(attendees);
      } catch (error) {
        console.error("Etkinlik veya katılımcı bilgisi alınamadı:", error);
      } finally {
        setLoadingAttendees(false);
      }
    };

    fetchData();
    hasFetched.current = true;
  }, []);

  useEffect(() => {
    if (!showSearch || !event) return;
    performSearch(""); // ⬅️ aşağıda utils fonksiyonu
  }, [showSearch, event]);

  const performSearch = async (name: string) => {
    if (!event) return; // güvenlik

    /* 1) Boşsa null gönder → tüm kullanıcılar gelsin */
    const queryName = name.trim() ? name.trim() : null;

    try {
      const res = await userService.search({
        ucSearchRequest: { name: queryName }, // null ⇒ tümü
        companyId: event.company.id, // sadece ilgili şirket
        branchId: event.branch.id, // ve şube
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error("Kullanıcı arama hatası:", err);
    }
  };

  /* 3) Seçilince katılımcıya ekleyen yardımcı */
  const handleSelect = async ({ key }: { key: string }) => {
    const user = searchResults.find((u) => String(u.id) === key);
    if (!user) return;

    try {
      setJoining(true);
      await sessionService.join({ sessionId, customerId: user.id });

      setAttendees((prev) => [
        ...prev,
        {
          id: user.id,
          firstName: user.ucGetResponse.name,
          lastName: user.ucGetResponse.surname,
          avatar: null,
          present: false,
        },
      ]);

      /* Arama kutusunu temizle ve kapat */
      setSearchValue("");
      setSearchResults([]);
      setShowSearch(false);
    } catch (err: any) {
      const errorCode = err?.response?.data?.errorCode;
      if (err.response?.status === 500) {
        message.error("Kullanıcıya tanımlı bir paket bulunamadı.");
      } else if (errorCode === 2003) {
        message.error("Bu kullanıcı zaten bu etkinliğe kayıtlı.");
      } else if (errorCode === 1902) {
        message.error("Kullanıcının kredisi yok.");
      } else {
        console.error("Kayıt hatası:", err);
        message.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setJoining(false);
    }
  };

  const menuItems = searchResults.map((u) => ({
    key: String(u.id), // key zorunlu ⇒ string
    label: (
      <>
        <Avatar size={24}>{u.ucGetResponse.name?.[0]}</Avatar>{" "}
        <span style={{ marginLeft: 8 }}>
          {u.ucGetResponse.name} {u.ucGetResponse.surname}
        </span>
      </>
    ),
  }));

  return (
    <StyledDrawer
      title={event?.name}
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      bodyStyle={{ padding: 20 }}
      extra={
        hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"]) && (
          <ActionButtonGroup>
            {dayjs(event?.start).isSameOrAfter(dayjs(), "day") && (
              <SquareButton icon={<EditFilled />} onClick={onEdit} />
            )}
            <SquareButton icon={<DeleteOutlined />} danger onClick={onDelete} />
          </ActionButtonGroup>
        )
      }
    >
      <Wrapper>
        {event?.start && event?.end && (
          <EventStatusAlert startDate={event.start} endDate={event.end} />
        )}

        <Paragraph style={{ marginTop: 10 }}>
          {event?.description ? event.description : t.noDescription}
        </Paragraph>

        <InfoBar>
          <DateTimeBox>
            <CalendarOutlined />
            <small>{dayjs(event?.start).format("D MMMM YYYY")}</small>
          </DateTimeBox>
          <DateTimeBox>
            <ClockCircleOutlined />
            <small>
              {dayjs(event?.start).format("HH:mm")} -{" "}
              {dayjs(event?.end).format("HH:mm")}
            </small>
          </DateTimeBox>
        </InfoBar>

        <Link to={`/companies/${event?.company.id}`}>
          <InfoBoxRow>
            <TrainerAvatar>
              <AntDesignOutlined />
            </TrainerAvatar>
            <TrainerInfo>
              <strong>{event?.company?.name}</strong>
              <small>{event?.branch?.name}</small>
            </TrainerInfo>
            <ArrowRightOutlined style={{ color: "gray", marginLeft: "auto" }} />
          </InfoBoxRow>
        </Link>

        <Link to={`/trainers/${event?.trainerId}`}>
          <TrainerBox>
            <TrainerAvatar>
              <UserOutlined />
            </TrainerAvatar>
            <TrainerInfo>
              <strong>
                {event?.trainerName} {event?.trainerSurname}
              </strong>
              <small>Trainer</small>
            </TrainerInfo>
            <ArrowRightOutlined style={{ color: "gray", marginLeft: "auto" }} />
          </TrainerBox>
        </Link>

        <Collapse
          defaultActiveKey={["attendees"]}
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
                      percent={(attendees.length / event?.capacity) * 100}
                      strokeWidth={40}
                      strokeColor="#7e97f2"
                      trailColor="#E6E3FF"
                      showInfo={false}
                    />
                    <CenteredText>
                      <strong>
                        {attendees.length}/{event?.capacity}
                      </strong>{" "}
                      {t.attendee}
                    </CenteredText>
                  </ProgressWrapper>
                  <Tooltip title={t.addAttendee}>
                    <FullWidthButton
                      icon={<MdPersonAddAlt1 />}
                      disabled={!canAdd || attendees.length >= event?.capacity}
                      onClick={() => setShowSearch(true)}
                    />
                  </Tooltip>
                </AttendeeHeader>
              ) : (
                <div style={{ marginBottom: 12 }}>
                  {showSearch && (
                    <Dropdown
                      open={showSearch}
                      placement="bottomLeft"
                      trigger={["click"]}
                      onOpenChange={(v) => setShowSearch(v)}
                      menu={{
                        items: menuItems,
                        onClick: ({ key }) => handleSelect({ key }),
                      }}
                    >
                      <Input
                        variant="filled"
                        autoFocus
                        allowClear
                        placeholder={t.searchUser}
                        value={searchValue}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSearchValue(val);
                          performSearch(val.trim());
                        }}
                      />
                    </Dropdown>
                  )}
                </div>
              )}
            </StickyAttendeeHeader>

            <AttendeeList>
              {loadingAttendees || joining /* 👈 iki yükleme durumu */ ? (
                <div style={{ textAlign: "center" }}>
                  <Spin />
                </div>
              ) : attendees.length === 0 ? (
                <p style={{ textAlign: "center", color: "gray" }}>
                  {t.noAttendeesYet}
                </p>
              ) : (
                attendees.map((user: any) => (
                  <AttendeeRow
                    key={user.id}
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    <AttendeeInfo>
                      <Avatar size={40} src={user.avatar}>
                        {user.firstName?.[0]}
                      </Avatar>
                      <div>
                        <AttendeeName>
                          {user.firstName} {user.lastName}
                        </AttendeeName>
                      </div>
                    </AttendeeInfo>

                    {!canAdd ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Tooltip title={user.present ? "Katıldı" : "Katılmadı"}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              background: user.present ? "#52c41a" : "#ff4d4f",
                              color: "#fff",
                            }}
                          >
                            {user.present ? (
                              <FaCheck style={{ fontSize: 10 }} />
                            ) : (
                              <CloseOutlined style={{ fontSize: 10 }} />
                            )}
                          </div>
                        </Tooltip>
                        <MoreOutlined
                          style={{
                            fontSize: 16,
                            color: "gray",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle more options click
                          }}
                        />
                      </div>
                    ) : (
                      <DeleteButton
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await sessionService.unjoin({
                              sessionId,
                              customerId: user.id,
                            });
                            setAttendees((prev) =>
                              prev.filter((att: any) => att.id !== user.id)
                            );
                          } catch (err) {
                            console.error("Unjoin hatası:", err);
                          }
                        }}
                      />
                    )}
                  </AttendeeRow>
                ))
              )}
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

  .ant-input-affix-wrapper {
    height: 40px;
    border-radius: 15px;
  }
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

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 8px;
`;

const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f5f5f5;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e6f7ff;
  }
`;
