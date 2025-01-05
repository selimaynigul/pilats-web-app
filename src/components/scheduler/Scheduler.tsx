import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import CustomEvent from "./Event";
import { Modal, Popover, Spin, message } from "antd";
import AddClassForm from "components/scheduler/add-class-form/AddClassForm";
import styled from "styled-components";
import dayjs from "dayjs";
import CustomToolbar from "components/scheduler/toolbar/scheduler-toolbar";
import {
  CalendarWrapper,
  LoadingOverlay,
  MoreButton,
  StyledModal,
} from "components/scheduler/SchedulerStyles";
import { usePagination } from "hooks";
import { sessionService } from "services";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);
type EventDropArgs = {
  event: any; // The event being dragged
  start: Date | string; // New start time (stringOrDate in react-big-calendar)
  end: Date | string; // New end time (stringOrDate in react-big-calendar)
  isAllDay?: boolean; // Indicates if the event was dropped on an all-day slot
};

const MyCalendar: React.FC = () => {
  const [loading, setLoading] = useState(false); // Loading state
  const [data, setData] = useState<any[]>([]); // Fetched event data

  const [company, setCompany] = useState({
    companyName: "All",
    id: null,
  });

  const params = useMemo(
    () => ({
      companyId: company?.id,
    }),
    [company?.id]
  );
  const fetchSessions = () => {
    // Fetch events from API
    setLoading(true);
    sessionService
      .search(params)
      .then((response) => {
        setData(response.data); // Set the fetched data
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        message.error("Failed to load events.");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchSessions();
  }, [params]);

  const events = data.map((event: any) => ({
    ...event,
    start: new Date(event.startDate), // Convert to Date object
    end: new Date(event.endDate), // Convert to Date object
    title: event.name, // Use `title` for the event name
  }));

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    const isSingleDay = dayjs(slotInfo.end)
      .subtract(1, "day")
      .isSame(slotInfo.start, "day");

    const hasEvent = events.some(
      (event) =>
        (slotInfo.start >= event.startDate && slotInfo.start < event.endDate) || // Overlap start
        (slotInfo.end > event.startDate && slotInfo.end <= event.endDate) || // Overlap end
        (slotInfo.start <= event.startDate && slotInfo.end >= event.endDate) // Event completely within selected range
    );

    /*   if (!isSingleDay || !hasEvent) {
      setSelectedRange(slotInfo);
      setIsModalVisible(true);
      }  */
    if (loading) return; // Prevent actions while loading
    setSelectedRange(slotInfo);
    setIsModalVisible(true);
  };

  const handleAddEvent = (values: any) => {
    setLoading(true); // Start loading

    const startDateTime = dayjs(values.startDate)
      .hour(dayjs(values.startTime).hour())
      .minute(dayjs(values.startTime).minute())
      .toDate();

    const eventDurationMinutes = dayjs(values.endTime).diff(
      dayjs(values.startTime),
      "minute"
    );

    const endDateTime = dayjs(values.endDate || values.startDate)
      .hour(dayjs(values.endTime).hour())
      .minute(dayjs(values.endTime).minute())
      .toDate();

    const repeatFrequency = values.repeatFrequency;
    const customDaysInterval = values.customDays || 2;

    const newEvents: any = [];
    let currentStart = startDateTime;

    // Generate repeated events
    if (values.repeat) {
      while (currentStart <= endDateTime) {
        const calculatedEnd = dayjs(currentStart)
          .add(eventDurationMinutes, "minute")
          .toDate();

        newEvents.push({
          id: events.length + newEvents.length + 1,
          title: values.className,
          start: currentStart,
          end: calculatedEnd, // Use the calculated end time
          allDay: false,
        });

        // Update the currentStart based on frequency
        if (repeatFrequency === "daily") {
          currentStart = dayjs(currentStart).add(1, "day").toDate();
        } else if (repeatFrequency === "weekly") {
          currentStart = dayjs(currentStart).add(1, "week").toDate();
        } else if (repeatFrequency === "monthly") {
          currentStart = dayjs(currentStart).add(1, "month").toDate();
        } else if (repeatFrequency === "custom") {
          currentStart = dayjs(currentStart)
            .add(customDaysInterval, "day")
            .toDate();
        }
      }
    } else {
      // If no repeat, add a single event
      newEvents.push({
        id: events.length + 1,
        title: values.className,
        start: startDateTime,
        end: dayjs(startDateTime).add(eventDurationMinutes, "minute").toDate(),
        allDay: false,
      });
    }

    /*     setEvents((prev) => [...prev, ...newEvents]);
     */ setLoading(false); // Stop loading
    setIsModalVisible(false);
  };

  const moveEvent = ({ event, start, end }: EventDropArgs) => {
    // Optimistically update the event in the UI
    const updatedEvent = {
      ...event,
      start: new Date(start), // Update the start date
      end: new Date(end), // Update the end date
    };

    setData((prevData) => prevData.filter((e) => e.id !== event.id));

    // Update the local state to reflect the changes immediately
    setData((prevData) =>
      prevData.map((e) => (e.id === event.id ? { ...e, ...updatedEvent } : e))
    );

    // Call the backend API to update the event
    sessionService
      .update({
        ...event,
        startDate: dayjs(start).format("YYYY-MM-DDTHH:mm:ss"), // Backend expects this format
        endDate: dayjs(end).format("YYYY-MM-DDTHH:mm:ss"),
      })
      .then(() => {
        fetchSessions(); // Refetch the events after updating
      })
      .catch((error) => {
        message.error("Failed to update event. Please try again.");

        // Revert the UI to the original position on failure
        setData((prevData) =>
          prevData.map((e) =>
            e.id === event.id
              ? { ...e, start: new Date(event.start), end: new Date(event.end) }
              : e
          )
        );
      });
  };

  const eventPropGetter = (event: any) => {
    return {
      style: {
        backgroundColor: "transparent", // Remove default background
        border: "none", // Remove border
        boxShadow: "none", // Remove shadows
      },
    };
  };

  const getDayEvents = (date: Date | string) => {
    const validDate = typeof date === "string" ? new Date(date) : date;

    const dayStart = new Date(validDate.setHours(0, 0, 0, 0));
    const dayEnd = new Date(validDate.setHours(23, 59, 59, 999));

    return events.filter(
      (event) => event.start >= dayStart && event.start <= dayEnd
    );
  };

  const renderDayEvents = (dayEvents: any[]) => {
    const firstEvent = dayEvents[0];
    const moreEventsCount = dayEvents.length - 1;

    return (
      <div>
        {/* Render the first event */}
        <CustomEvent event={firstEvent} dayEvents={dayEvents} />

        {/* Render the "More Button" if there are additional events */}
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

  const nameInputRef = useRef<any>(null);

  return (
    <CalendarWrapper>
      {loading && (
        <LoadingOverlay>
          <Spin tip="Loading..." /> {/* Spinner */}
        </LoadingOverlay>
      )}
      <DragAndDropCalendar
        events={events}
        localizer={localizer}
        selectable
        onSelectSlot={handleSelectSlot}
        onEventDrop={moveEvent}
        resizable={false} // Disable resizing entirely
        style={{ height: 700 }}
        components={{
          toolbar: (props) => (
            <CustomToolbar {...props} setCompany={setCompany} />
          ),
          event: ({ event }) => {
            const dayEvents = getDayEvents((event as any).startDate);
            return renderDayEvents(dayEvents);
          },
        }}
        eventPropGetter={eventPropGetter} // Apply custom styles
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
          onSubmit={handleAddEvent}
          selectedRange={selectedRange}
          nameRef={nameInputRef}
        />
      </StyledModal>
    </CalendarWrapper>
  );
};

export default MyCalendar;
