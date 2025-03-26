import React, { useEffect, useState, useRef, useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { useParams, useSearchParams } from "react-router-dom"; // Import useParams
import dayjs from "dayjs";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import CustomEvent from "./event/Event";
import { message, Popover, Spin } from "antd";
import AddClassForm from "components/scheduler/add-class-form/AddClassForm";
import CustomToolbar from "components/scheduler/toolbar/scheduler-toolbar";
import {
  CalendarWrapper,
  LoadingOverlay,
  MoreButton,
  StyledModal,
} from "components/scheduler/SchedulerStyles";
import { sessionService } from "services";
import { getBranchId, getCompanyId, hasRole } from "utils/permissionUtils";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "hooks";
import "moment/locale/tr";
import "moment/locale/en-gb";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

type EventDropArgs = {
  event: any;
  start: Date | string;
  end: Date | string;
  isAllDay?: boolean;
};

const Scheduler: React.FC = () => {
  const { date: urlDate } = useParams<{ date?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nameInputRef = useRef<any>(null);
  const sessionId = searchParams.get("session");
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(
    sessionId
  );
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const { t, userLanguage } = useLanguage();
  const [company, setCompany] = useState<any>({
    companyName: hasRole(["ADMIN"]) ? t.selectCompany : t.selectBranch,
    id: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const [visibleRange, setVisibleRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const [date, setDate] = useState<Date>(() => {
    if (urlDate && dayjs(urlDate, "YYYY-MM", true).isValid()) {
      return dayjs(urlDate).toDate();
    }
    const savedDate = localStorage.getItem("savedCalendarDate");
    return savedDate ? new Date(savedDate) : new Date();
  });

  const params = useMemo(() => {
    const isAdmin = hasRole(["ADMIN"]);
    return {
      companyId: isAdmin
        ? company?.branchName
          ? company?.companyId
          : company?.id
        : getCompanyId(),
      branchId: company.branchName ? company.id : null,
      searchByPageDto: {
        pageSize: 200,
      },
    };
  }, [company]);

  useEffect(() => {
    if (userLanguage === "tr") {
      moment.locale("tr");
    } else {
      moment.locale("en-gb");
    }
  }, [userLanguage]);

  const messages = useMemo(
    () => ({
      today: t.today || "Today",
      month: t.month || "Month",
      week: t.week || "Week",
      day: t.day || "Day",
      agenda: t.agenda || "Agenda",
      date: t.date || "Date",
      time: t.time || "Time",
      event: t.event || "Event",
      allDay: t.allDay || "All Day",
      noEventsInRange: t.noEventsInRange || "No events in range.",
    }),
    [t]
  );

  useEffect(() => {
    if (highlightedEventId) {
      const timer = setTimeout(() => setHighlightedEventId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      setHighlightedEventId(sessionId);

      const timer = setTimeout(() => setHighlightedEventId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [sessionId]);

  useEffect(() => {
    if (urlDate && dayjs(urlDate, "YYYY-MM", true).isValid()) {
      const newDate = dayjs(urlDate, "YYYY-MM").toDate();
      setDate(newDate);
    }
  }, [urlDate]);

  useEffect(() => {
    if (date) {
      const start: Date = dayjs(date)
        .startOf("month")
        .subtract(7, "day")
        .toDate();
      const end: Date = dayjs(date).endOf("month").add(7, "day").toDate();
      setVisibleRange({ start, end });
    }
  }, [date]);

  useEffect(() => {
    if (visibleRange) {
      fetchSessions(visibleRange.start, visibleRange.end, true);
    }
  }, [visibleRange, params]);

  const updateVisibleDate = (range: { start: Date; end: Date } | Date[]) => {
    const startDate = Array.isArray(range) ? range[0] : range.start;
    const endDate = Array.isArray(range) ? range[range.length - 1] : range.end;

    const middleDate = new Date(
      (new Date(startDate).getTime() + new Date(endDate).getTime()) / 2
    );
    setDate(middleDate);

    localStorage.setItem("savedCalendarDate", middleDate.toISOString());
    navigate(`/sessions/${dayjs(middleDate).format("YYYY-MM")}`);
  };

  const fetchSessions = (
    startDate: Date,
    endDate: Date,
    showLoading: boolean
  ) => {
    if (showLoading) setLoading(true);

    const finalParams = {
      ...params,
      startDate: dayjs(startDate).toISOString(),
      endDate: dayjs(endDate).toISOString(),
    };

    sessionService
      .search(finalParams)
      .then((response) => {
        const formattedSessions = response.data.map((session: any) => ({
          ...session,
          start: new Date(session.startDate),
          end: new Date(session.endDate),
        }));
        setSessions(formattedSessions);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        message.error("Failed to load events.");
      })
      .finally(() => {
        if (showLoading) setLoading(false);
      });
  };

  const selectSlot = (slotInfo: { start: Date; end: Date }) => {
    if (loading) return;
    if (hasRole(["BRANCH_ADMIN"])) {
      setSelectedRange(slotInfo);
      setIsModalVisible(true);
    }
  };

  const addSession = (values: any) => {
    setLoading(true);

    const [startTime, endTime] = values.timeRange || [null, null];

    const payload = {
      name: values.className,
      description: values.description || "No description provided.",
      startDate: dayjs(values.startDate)
        .hour(dayjs(startTime).hour())
        .minute(dayjs(startTime).minute())
        .format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(values.startDate)
        .hour(dayjs(endTime).hour())
        .minute(dayjs(endTime).minute())
        .format("YYYY-MM-DDTHH:mm:ss"),
      branchId: hasRole(["COMPANY_ADMIN"]) ? values.branch : getBranchId(),
      trainerId: values.trainer,
      isRepeat: values.repeat || false,
      repeatDay:
        values.repeatFrequency === "weekly"
          ? 7
          : values.repeatFrequency === "monthly"
            ? 30
            : values.repeatFrequency === "custom"
              ? values.customDays
              : 1, // Days between repeats
      repeatEndDate: values.endDate
        ? dayjs(values.endDate).format("YYYY-MM-DD")
        : null,
    };

    sessionService
      .add(payload)
      .then(() => {
        message.success("Event added successfully!");
        if (visibleRange) {
          fetchSessions(visibleRange.start, visibleRange.end, true);
        }
      })
      .catch((error) => {
        console.error("Failed to add event:", error);
        message.error("Failed to add event. Please try again.");
      })
      .finally(() => {
        setLoading(false); // Stop loading
        setIsModalVisible(false); // Close the modal
      });
  };

  const moveSession = ({ event, start, end }: EventDropArgs) => {
    const updatedSession = {
      ...event,
      startDate: dayjs(start).format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(end).format("YYYY-MM-DDTHH:mm:ss"),
      start: new Date(start),
      end: new Date(end),
    };

    setSessions((prev) =>
      prev.map((e) => (e.id === event.id ? updatedSession : e))
    );

    sessionService
      .update({
        ...event,
        startDate: dayjs(start).format("YYYY-MM-DDTHH:mm:ss"),
        endDate: dayjs(end).format("YYYY-MM-DDTHH:mm:ss"),
      })
      .then(() => {
        if (visibleRange) {
          fetchSessions(visibleRange.start, visibleRange.end, false);
        }
      })
      .catch((error) => {
        message.error("Failed to update event. Please try again.");
        setSessions((prev) => prev.map((e) => (e.id === event.id ? event : e)));
      });
  };

  const eventPropGetter = (event: any) => {
    const isHighlightedDay =
      highlightedEventId &&
      getDaySessions((event as any).startDate).some(
        (dayEvent: any) => dayEvent.id === highlightedEventId
      );

    if (isHighlightedDay) {
      return {
        className: "highlighted-event",
        style: {
          animation: "highlight 1s ease-out",
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
        },
      };
    }

    return {
      style: {
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
      },
    };
  };

  const getDaySessions = (date: Date | string) => {
    const validDate = typeof date === "string" ? new Date(date) : date;

    const dayStart = new Date(validDate.setHours(0, 0, 0, 0));
    const dayEnd = new Date(validDate.setHours(23, 59, 59, 999));

    return sessions.filter(
      (session) => session.start >= dayStart && session.start <= dayEnd
    );
  };

  const renderSessions = (dayEvents: any[]) => {
    const firstEvent = dayEvents[0];
    const moreEventsCount = dayEvents.length - 1;

    return (
      <div>
        <CustomEvent
          event={firstEvent}
          dayEvents={dayEvents}
          fetch={() => {
            if (visibleRange) {
              return fetchSessions(visibleRange.start, visibleRange.end, true);
            }
          }}
          highlightedEventId={highlightedEventId}
        />

        {moreEventsCount > 0 && (
          <Popover
            trigger="click"
            content={
              <div>
                {dayEvents.slice(1).map((event, index) => (
                  <div style={{ marginBottom: 5, width: 200 }}>
                    <CustomEvent
                      showTime={true}
                      key={index}
                      event={event}
                      dayEvents={dayEvents}
                      fetch={() => {
                        if (visibleRange) {
                          return fetchSessions(
                            visibleRange.start,
                            visibleRange.end,
                            true
                          );
                        }
                      }}
                      highlightedEventId={highlightedEventId}
                    />
                  </div>
                ))}
              </div>
            }
            arrow={false}
          >
            <MoreButton>+{moreEventsCount} more</MoreButton>
          </Popover>
        )}
      </div>
    );
  };

  return (
    <CalendarWrapper>
      {loading && (
        <LoadingOverlay>
          <Spin tip="Loading..." />
        </LoadingOverlay>
      )}
      <DragAndDropCalendar
        defaultDate={date}
        date={date}
        draggableAccessor={() => hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"])}
        events={sessions}
        localizer={localizer}
        selectable={hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"])}
        onSelectSlot={selectSlot}
        onEventDrop={moveSession}
        resizable={false}
        messages={messages}
        style={{ height: 700 }}
        onRangeChange={updateVisibleDate}
        components={{
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              setCompany={setCompany}
              company={company}
              setIsModalVisible={setIsModalVisible}
            />
          ),
          event: ({ event }) => {
            const dayEvents = getDaySessions((event as any).startDate);
            return renderSessions(dayEvents);
          },
        }}
        eventPropGetter={eventPropGetter}
      />

      <StyledModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        closable={false}
        afterOpenChange={(open) => {
          if (open) {
            nameInputRef.current?.focus();
          }
        }}
      >
        <AddClassForm
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={addSession}
          selectedRange={selectedRange}
          nameRef={nameInputRef}
        />
      </StyledModal>
    </CalendarWrapper>
  );
};

export default Scheduler;
