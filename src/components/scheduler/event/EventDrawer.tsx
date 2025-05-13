import React, { useEffect, useRef, useState } from "react";
import {
  Drawer,
  Avatar,
  Button,
  Input,
  Progress,
  message,
  Tooltip,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditFilled,
  ArrowRightOutlined,
  UserOutlined,
  AntDesignOutlined,
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
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  const [event, setEvent] = useState<any | null>(null);

  const { t } = useLanguage();

  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [searchValue, setSearchValue] = useState("");

  const showAttendance = dayjs().isAfter(dayjs(event?.start), "day");

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

        <Paragraph>{event?.description}</Paragraph>

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
              <small>Expert Yoga Trainer</small>
            </TrainerInfo>
            <ArrowRightOutlined style={{ color: "gray", marginLeft: "auto" }} />
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
                      attendees
                    </CenteredText>
                  </ProgressWrapper>
                  <Tooltip title="Katılımcı ekle">
                    <FullWidthButton
                      icon={<MdPersonAddAlt1 />}
                      disabled={attendees.length >= event?.capacity}
                      onClick={() => setShowSearch(true)}
                    />
                  </Tooltip>
                </AttendeeHeader>
              ) : (
                <div style={{ marginBottom: 12 }}>
                  <Input
                    autoFocus
                    placeholder="Kullanıcı ara..."
                    allowClear
                    value={searchValue}
                    onChange={async (e) => {
                      const value = e.target.value;
                      setSearchValue(value);

                      if (!value.trim()) {
                        setSearchResults([]);
                        return;
                      }

                      try {
                        const res = await userService.search({
                          ucSearchRequest: { name: value },
                        });
                        setSearchResults(res.data);
                        console.log("Kullanıcı arama sonuçları:", res.data);
                      } catch (err) {
                        console.error("Kullanıcı arama hatası:", err);
                      }
                    }}
                  />
                  <SearchResults>
                    {searchResults.map((user) => (
                      <SearchResultItem
                        key={user.id}
                        onClick={async () => {
                          console.log(
                            "Selected user:",
                            user.ucGetResponse.name
                          );
                          try {
                            await sessionService.join({
                              sessionId,
                              customerId: user.id,
                            });

                            const newUser = {
                              id: user.id,
                              firstName: user.ucGetResponse.name,
                              lastName: user.ucGetResponse.surname,
                              avatar: null,
                              present: false,
                            };

                            setAttendees((prev) => [...prev, newUser]);
                            setSearchValue("");
                            setSearchResults([]);
                            setShowSearch(false);
                          } catch (err: any) {
                            const errorCode = err?.response?.data?.errorCode;
                            if (err.response?.status === 500) {
                              message.error(
                                "Kullanıcıya tanımlı bir paket bulunamadı."
                              );
                            } else if (errorCode === 2003) {
                              message.error(
                                "Bu kullanıcı zaten bu etkinliğe kayıtlı."
                              );
                            } else if (errorCode === 1902) {
                              message.error("Kullanıcının kredisi yok.");
                            } else {
                              console.error("Kayıt hatası:", err);
                              message.error(
                                "Bir hata oluştu. Lütfen tekrar deneyin."
                              );
                            }
                          }
                        }}
                      >
                        <Avatar size={32}>{user.name?.[0]}</Avatar>
                        <div>
                          <strong>
                            {user.ucGetResponse.name}{" "}
                            {user.ucGetResponse.surname}
                          </strong>
                        </div>
                      </SearchResultItem>
                    ))}
                  </SearchResults>
                </div>
              )}
            </StickyAttendeeHeader>

            <AttendeeList>
              {loadingAttendees ? (
                <p>Katılımcılar yükleniyor...</p>
              ) : attendees.length === 0 ? (
                <p>Henüz katılımcı yok.</p>
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
                        {showAttendance && (
                          <AttendanceStatus $present={user.present}>
                            {user.present ? "Katıldı" : "Katılmadı"}
                          </AttendanceStatus>
                        )}
                      </div>
                    </AttendeeInfo>
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

const EventStatus = styled.div`
  background: blue;
  height: 10px;
  width: 100%;
`;

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
