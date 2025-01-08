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
import { sessionService } from "services";
import { getBranchId, hasRole } from "utils/permissionUtils";

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

  const handleRangeChange = (range: { start: Date; end: Date } | Date[]) => {
    const startDate = Array.isArray(range) ? range[0] : range.start;
    const endDate = Array.isArray(range) ? range[range.length - 1] : range.end;

    setVisibleRange({ start: startDate, end: endDate });

    // Save the middle date of the range to local storage
    const middleDate = new Date(
      (new Date(startDate).getTime() + new Date(endDate).getTime()) / 2
    );
    localStorage.setItem("savedCalendarDate", middleDate.toISOString());
  };

  const fetchSessions = (startDate: Date, endDate: Date) => {
    setLoading(true);

    const params = {
      startDate: dayjs(startDate).toISOString(), // Use ISO 8601 with time
      endDate: dayjs(endDate).toISOString(),
      branchId: getBranchId(),
      searchByPageDto: {
        pageSize: 200,
      },
    };

    sessionService
      .search(params)
      .then((response) => {
        console.log("Fetched Sessions:", response.data); // Debugging
        setData(response.data); // Update the state with fetched data
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        message.error("Failed to load events.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [visibleRange, setVisibleRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const [defaultDate, setDefaultDate] = useState<Date>(() => {
    // Retrieve the saved date from local storage or default to today
    const savedDate = localStorage.getItem("savedCalendarDate");
    return savedDate ? new Date(savedDate) : new Date();
  });

  useEffect(() => {
    if (visibleRange) {
      fetchSessions(visibleRange.start, visibleRange.end);
    }
  }, [visibleRange]);

  useEffect(() => {
    const start: Date = dayjs(defaultDate)
      .startOf("month")
      .subtract(7, "day")
      .toDate();
    const end: Date = dayjs(defaultDate).endOf("month").add(7, "day").toDate();
    setVisibleRange({ start, end });
    fetchSessions(start, end);
  }, []);

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
    if (loading) return;
    if (hasRole(["BRANCH_ADMIN"])) {
      setSelectedRange(slotInfo);
      setIsModalVisible(true);
    }
  };

  const handleAddEvent = (values: any) => {
    setLoading(true); // Start loading

    const [startTime, endTime] = values.timeRange || [null, null];

    // Prepare the payload to send to the backend
    const payload = {
      name: values.className,
      description: values.description || "No description provided.",
      startDate: dayjs(values.startDate)
        .hour(dayjs(startTime).hour())
        .minute(dayjs(startTime).minute())
        .format("YYYY-MM-DDTHH:mm:ss"), // Format start date and time
      endDate: dayjs(values.startDate)
        .hour(dayjs(endTime).hour())
        .minute(dayjs(endTime).minute())
        .format("YYYY-MM-DDTHH:mm:ss"), // Format end date and time
      branchId: getBranchId(),
      trainerId: values.trainer,
      isRepeat: values.repeat || false, // Indicate if it is a repeating event
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
        : null, // Optional repeat end date
    };

    console.log("payload", payload);

    // Call the backend API to add the event
    sessionService
      .add(payload)
      .then(() => {
        message.success("Event added successfully!");
        // Refetch sessions for the current visible range
        if (visibleRange) {
          fetchSessions(visibleRange.start, visibleRange.end);
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
        // Refetch sessions for the current visible range
        if (visibleRange) {
          fetchSessions(visibleRange.start, visibleRange.end);
        }
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
        <CustomEvent
          event={firstEvent}
          dayEvents={dayEvents}
          fetch={() => {
            if (visibleRange) {
              return fetchSessions(visibleRange.start, visibleRange.end);
            }
          }}
        />

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
          <Spin tip="Loading..." />
        </LoadingOverlay>
      )}
      <DragAndDropCalendar
        defaultDate={defaultDate}
        draggableAccessor={() => hasRole(["BRANCH_ADMIN"])} // Disable dragging for all events
        events={events}
        localizer={localizer}
        selectable={hasRole(["BRANCH_ADMIN"])}
        onSelectSlot={handleSelectSlot}
        onEventDrop={moveEvent}
        resizable={false}
        style={{ height: 700 }}
        onRangeChange={handleRangeChange}
        components={{
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              setCompany={setCompany}
              setIsModalVisible={setIsModalVisible}
            />
          ),
          event: ({ event }) => {
            const dayEvents = getDayEvents((event as any).startDate);
            return renderDayEvents(dayEvents);
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
          onSubmit={handleAddEvent}
          selectedRange={selectedRange}
          nameRef={nameInputRef}
        />
      </StyledModal>
    </CalendarWrapper>
  );
};

export default MyCalendar;
