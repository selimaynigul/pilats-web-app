import React, { useState, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { CalendarWrapper } from "./SchedulerStyles";
import CustomEvent from "./Event";
import CustomToolbar from "./Toolbar";
import { Modal, Form, Input, DatePicker, Button, Select } from "antd";
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
  {
    title: "Yoga Dersi",
    start: new Date(2024, 9, 14, 9, 0),
    end: new Date(2024, 9, 14, 17, 0),
    allDay: false,
    id: 3,
  },
];

// Define types for the event and function parameters
interface MyEvent {
  id: string | number;
  title?: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

interface MoveEventArgs {
  event: MyEvent;
  start: Date;
  end: Date;
  isAllDay?: boolean;
}

const MyCalendar: React.FC = () => {
  const [myEvents, setMyEvents] = useState(events);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const moveEvent = useCallback(
    ({ event, start, end }: MoveEventArgs) => {
      setMyEvents((prev) =>
        prev.map((ev) => (ev.id === event.id ? { ...ev, start, end } : ev))
      );
    },
    [setMyEvents]
  );

  const handleDateClick = (slotInfo: { start: Date; end: Date }) => {
    setSelectedDate(slotInfo.start);
    form.setFieldsValue({
      startDate: dayjs(slotInfo.start),
      endDate: dayjs(slotInfo.end),
    });
    setIsModalVisible(true);
  };

  const handleAddEvent = () => {
    form.validateFields().then((values) => {
      const newEvent: MyEvent = {
        id: myEvents.length + 1,
        title: values.className,
        start: values.startDate.toDate(),
        end: values.endDate.toDate(),
        allDay: false,
      };
      setMyEvents((prev: any) => [...prev, newEvent]);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  return (
    <CalendarWrapper>
      <DnDCalendar
        events={myEvents}
        localizer={localizer}
        selectable
        onSelectSlot={handleDateClick}
        /*  onEventDrop={moveEvent} */
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
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="add" type="primary" onClick={handleAddEvent}>
            Add
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="className"
            label="Class Name"
            rules={[{ required: true, message: "Please enter the class name" }]}
          >
            <Input placeholder="Enter class name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date & Time"
            rules={[
              {
                required: true,
                message: "Please select the start date and time",
              },
            ]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              defaultValue={dayjs(selectedDate)}
            />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date & Time"
            rules={[
              {
                required: true,
                message: "Please select the end date and time",
              },
            ]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="trainer"
            label="Trainer"
            rules={[{ required: true, message: "Please select a trainer" }]}
          >
            <Select
              showSearch
              placeholder="Select a trainer"
              options={[
                { label: "Trainer 1", value: "trainer1" },
                { label: "Trainer 2", value: "trainer2" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </CalendarWrapper>
  );
};

export default MyCalendar;
