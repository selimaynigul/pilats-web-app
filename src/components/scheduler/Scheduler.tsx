// MyCalendar.tsx
import React from "react";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { CalendarWrapper } from "./SchedulerStyles";
import CustomEvent from "./Event";
import CustomToolbar from "./Toolbar";
import { useState, useCallback } from "react";

const DnDCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const events = [
  {
    title: "Zumba Eğitimi",
    start: new Date(2024, 9, 12, 10, 0),
    end: new Date(2024, 9, 12, 12, 0),
    allDay: false,
    id: 1,
  },
  {
    title: "Grup Kardio Dersi",
    start: new Date(2024, 9, 13, 13, 0),
    end: new Date(2024, 9, 13, 14, 0),
    allDay: false,
    id: 2,
  },
  {
    title: "Yoga Dersi",
    start: new Date(2024, 9, 14, 9, 0),
    end: new Date(2024, 9, 14, 17, 0), // Oct 14, 2024, 5:00 PM
    allDay: false,
    id: 3,
  },
];

// Define the type for your event object
export interface MyEvent {
  id: string | number;
  title?: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

// Define the type for the function parameter
interface MoveEventArgs {
  event: MyEvent;
  start: Date;
  end: Date;
  isAllDay?: boolean;
}

const MyCalendar: React.FC = () => {
  const [myEvents, setMyEvents] = useState(events);

  const moveEvent = useCallback(
    ({
      event,
      start,
      end,
      isAllDay: droppedOnAllDaySlot = false,
    }: MoveEventArgs) => {
      const { allDay } = event;

      // Update the `allDay` property based on where the event was dropped
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      } else if (allDay && !droppedOnAllDaySlot) {
        event.allDay = false;
      }

      /* setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) || {
          title: "", // Provide a default title if it doesn't exist
          start: new Date(), // Provide a default start date
          end: new Date(), // Provide a default end date
          allDay: false, // Default value for allDay
        };
        const filtered = prev.filter((ev) => ev.id !== event.id);

        // Ensure the updated event has all required properties of MyEvent
        const updatedEvent: MyEvent = {
          id: existing.id || event.id,
          title: existing.title || event.title, // Default to the existing title or current event title
          start,
          end,
          allDay: event.allDay,
        };

        return [...filtered, updatedEvent];
      }); */
    },
    [setMyEvents]
  );

  return (
    <CalendarWrapper>
      <DnDCalendar
        events={myEvents}
        localizer={localizer}
        onEventDrop={moveEvent}
        style={{ height: "calc(100vh - 80px" }} // Use flex-grow + full width
        resizable
        draggableAccessor={() => true}
        components={{
          toolbar: CustomToolbar,
          eventWrapper: CustomEvent,
        }}
      />
    </CalendarWrapper>
  );
};

export default MyCalendar;
