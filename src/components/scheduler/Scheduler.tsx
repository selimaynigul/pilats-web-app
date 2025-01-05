import React, { useEffect, useRef, useState } from "react";
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
  const [events, setEvents] = useState([
    {
      id: 0,
      title: "Yoga Class",
      start: new Date(2024, 10, 8, 10, 0),
      end: new Date(2024, 10, 8, 11, 0),
    },
    {
      id: 1,
      title: "Lunch Break",
      start: new Date(2024, 10, 8, 13, 0),
      end: new Date(2024, 10, 8, 14, 0),
    },
    {
      id: 2,
      title: "Meeting with Team",
      start: new Date(2024, 10, 8, 10, 0),
      end: new Date(2024, 10, 8, 11, 0),
    },
    {
      id: 3,
      title: "Pilates Class",
      start: new Date(2024, 10, 8, 13, 0),
      end: new Date(2024, 10, 8, 14, 0),
    },
  ]);

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
        (slotInfo.start >= event.start && slotInfo.start < event.end) || // Overlap start
        (slotInfo.end > event.start && slotInfo.end <= event.end) || // Overlap end
        (slotInfo.start <= event.start && slotInfo.end >= event.end) // Event completely within selected range
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

    setEvents((prev) => [...prev, ...newEvents]);
    setLoading(false); // Stop loading
    setIsModalVisible(false);
  };

  const moveEvent = ({ event, start, end, isAllDay }: EventDropArgs) => {
    setLoading(true);

    const updatedEvent = { ...event, start, end };

    const nextEvents = events.map((evt) =>
      evt.id === event.id ? updatedEvent : evt
    );

    setEvents(nextEvents);
    setLoading(false); // Stop loading
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

  const getDayEvents = (date: Date) => {
    // Find all events for a specific day
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
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
                    <strong>{event.title}</strong>
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

  const nameInputRef = useRef<any>(null); // Create a ref for the name input field

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
          toolbar: CustomToolbar,
          event: ({ event }) => {
            const dayEvents = getDayEvents((event as any).start); // Get all events for the day
            return renderDayEvents(dayEvents); // Pass day events to the rendering function
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
