// MyCalendar.tsx

import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { CalendarWrapper } from "./SchedulerStyles";
import CustomEvent from "./Event";
import CustomToolbar from "./toolbar/scheduler-toolbar";
import { Modal } from "antd";
import AddClassForm from "./add-class-form/AddClassForm";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

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
];

const MyCalendar: React.FC = () => {
  const [myEvents, setMyEvents] = useState(events);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedRange(slotInfo);
    setIsModalVisible(true);
  };

  const handleAddEvent = (values: any) => {
    const newEvent = {
      id: myEvents.length + 1,
      title: values.className,
      start: dayjs(values.startDate)
        .hour(dayjs(values.startTime).hour())
        .minute(dayjs(values.startTime).minute())
        .toDate(),
      end: dayjs(values.startDate)
        .hour(dayjs(values.startTime).hour())
        .minute(dayjs(values.startTime).minute())
        .toDate(),
      allDay: false,
    };
    setMyEvents((prev) => [...prev, newEvent]);
    setIsModalVisible(false);
  };

  return (
    <CalendarWrapper>
      <DnDCalendar
        events={myEvents}
        localizer={localizer}
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: "600px" }}
        resizable
        draggableAccessor={() => true}
        components={{
          toolbar: CustomToolbar,
          eventWrapper: CustomEvent,
        }}
      />

      <Modal
        title="Add New Class"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <AddClassForm
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleAddEvent}
          selectedRange={selectedRange}
        />
      </Modal>
    </CalendarWrapper>
  );
};

export default MyCalendar;
