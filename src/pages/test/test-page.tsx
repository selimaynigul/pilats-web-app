import React, { useState, useRef } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import CustomEvent from "./test-event";
import styled from "styled-components";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const CalendarWrapper = styled.div`
  .rbc-toolbar {
    margin-bottom: 1rem;
  }
`;

const TestCalendar: React.FC = () => {
  const [events, setEvents] = useState([
    {
      id: 0,
      title: "Meeting with Team",
      start: new Date(2023, 10, 8, 10, 0),
      end: new Date(2023, 10, 8, 11, 0),
    },
    {
      id: 1,
      title: "Lunch Break",
      start: new Date(2023, 10, 8, 13, 0),
      end: new Date(2023, 10, 8, 14, 0),
    },
  ]);
  const [currentDate, setCurrentDate] = useState(new Date(2023, 10, 8)); // Current view date
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Timer reference

  const moveEvent = ({ event, start, end }: any) => {
    const updatedEvents = events.map((evt) =>
      evt.id === event.id ? { ...evt, start, end } : evt
    );
    setEvents(updatedEvents);
  };

  const addNewEvent = ({ start, end }: any) => {
    const newId = events.length
      ? Math.max(...events.map((evt) => evt.id)) + 1
      : 0;
    const newEvent = {
      id: newId,
      title: "New Event",
      start,
      end,
    };
    setEvents([...events, newEvent]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    const calendarWidth = e.currentTarget.clientWidth;
    const mouseX = e.clientX;

    // If near the right edge, start a timer to navigate to the next month
    if (mouseX > calendarWidth - 100) {
      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          setCurrentDate(moment(currentDate).add(1, "month").toDate());
          timerRef.current = null; // Reset the timer
        }, 1000); // 1 second delay
      }
    } else {
      // Clear the timer if the mouse moves away from the right edge
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
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

  return (
    <CalendarWrapper>
      <DragAndDropCalendar
        events={events}
        localizer={localizer}
        date={currentDate} // Controlled date for navigation
        onNavigate={(date) => setCurrentDate(date)} // Update current date on manual navigation
        selectable
        onDragOver={handleDragOver} // Track dragging over the calendar
        onEventDrop={moveEvent}
        onSelectSlot={addNewEvent}
        components={{
          event: CustomEvent, // Custom event component
        }}
        eventPropGetter={eventPropGetter} // Apply custom styles
        style={{ height: 700 }}
        defaultView={Views.MONTH}
      />
    </CalendarWrapper>
  );
};

export default TestCalendar;
