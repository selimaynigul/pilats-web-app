import React, { useEffect, useState, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import { useParams, useSearchParams } from "react-router-dom"; // Import useParams
import dayjs from "dayjs";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import CustomEvent from "./Event";
import { message, Modal, Popover, Spin } from "antd";
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
import styled from "styled-components";

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
  const [company, setCompany] = useState({
    companyName: "All",
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

  useEffect(() => {
    if (highlightedEventId) {
      const timer = setTimeout(() => setHighlightedEventId(null), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const start: Date = dayjs(date)
      .startOf("month")
      .subtract(7, "day")
      .toDate();
    const end: Date = dayjs(date).endOf("month").add(7, "day").toDate();
    setVisibleRange({ start, end });
  }, [date]);

  useEffect(() => {
    if (visibleRange) {
      fetchSessions(visibleRange.start, visibleRange.end, true);
    }
  }, [visibleRange]);

  const updateVisibleDate = (range: { start: Date; end: Date } | Date[]) => {
    const startDate = Array.isArray(range) ? range[0] : range.start;
    const endDate = Array.isArray(range) ? range[range.length - 1] : range.end;

    const middleDate = new Date(
      (new Date(startDate).getTime() + new Date(endDate).getTime()) / 2
    );
    setDate(middleDate);

    localStorage.setItem("savedCalendarDate", middleDate.toISOString());
    navigate(`/classes/${dayjs(middleDate).format("YYYY-MM")}`);
  };

  const fetchSessions = (
    startDate: Date,
    endDate: Date,
    showLoading: boolean
  ) => {
    if (showLoading) setLoading(true);

    const params = {
      startDate: dayjs(startDate).toISOString(),
      endDate: dayjs(endDate).toISOString(),
      branchId: getBranchId(),
      companyId: getCompanyId() || company.id || null,
      searchByPageDto: {
        pageSize: 200,
      },
    };

    sessionService
      .search(params)
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
      branchId: getBranchId(),
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
        // Refetch sessions for the current visible range
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
                {dayEvents.map((event, index) => (
                  <div key={index}>
                    <strong>{event.name}</strong>
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
        draggableAccessor={() => hasRole(["BRANCH_ADMIN"])}
        events={sessions}
        localizer={localizer}
        selectable={hasRole(["BRANCH_ADMIN"])}
        onSelectSlot={selectSlot}
        onEventDrop={moveSession}
        resizable={false}
        style={{ height: 700 }}
        onRangeChange={updateVisibleDate}
        components={{
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              setCompany={setCompany}
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
        closable={false} // Removes the close icon
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
