import React, { useState } from "react";
import { Button, Card, Form, Input, DatePicker, TimePicker, List } from "antd";
import StepModal, { CustomStep, FormRow } from "components/StepModal";
import styled from "styled-components";

export interface CalendarEvent {
  trainer: string;
  topic: string;
  date: string;
  time: string;
}

const TestCalendar: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      trainer: "John Doe",
      date: "2025-06-15",
      time: "14:00",
      topic: "React Basics",
    },
  ]);
  const [form] = Form.useForm();

  const handleAddEvent = () => {
    form
      .validateFields()
      .then((values) => {
        const newEvent: CalendarEvent = {
          trainer: values.trainer,
          topic: values.topic,
          date: values.date.format("YYYY-MM-DD"),
          time: values.time.format("HH:mm"),
        };
        setEvents([...events, newEvent]);
        form.resetFields();
        setModalVisible(false);
      })
      .catch((info) => console.error("Validation Failed:", info));
  };
  const steps: CustomStep[] = [
    {
      label: "About trainer",
      buttonText: "Save & Continue",
      blocks: [
        {
          title: "Personal Info",
          description: "Provide trainer's personal info",
          fields: [
            <Form.Item name="job">
              <Input placeholder="Job" />
            </Form.Item>,
            <FormRow>
              <Form.Item name="firstname">
                <Input placeholder="Firstname *" />
              </Form.Item>
              <Form.Item name="lastname">
                <Input placeholder="Lastname *" />
              </Form.Item>
            </FormRow>,
            <FormRow>
              <Form.Item name="gender">
                <Input placeholder="Gender" />
              </Form.Item>
              <Form.Item name="birthdate">
                <DatePicker style={{ width: "100%" }} placeholder="Birthdate" />
              </Form.Item>
            </FormRow>,
          ],
        },
        {
          title: "Contact Info",
          description: "Provide trainer's contact info",
          fields: [
            <FormRow>
              <Form.Item name="email">
                <Input placeholder="Email *" />
              </Form.Item>
              <Form.Item name="phone">
                <Input placeholder="Phone No *" />
              </Form.Item>
            </FormRow>,
            <Form.Item name="location">
              <Input placeholder="Location" />
            </Form.Item>,
          ],
        },
      ],
    },
    {
      label: "Company info",
      buttonText: "Add Trainer",
      blocks: [
        {
          title: "Company Info",
          description: "Provide trainer's personal info",
          fields: [
            <Form.Item
              name="company"
              style={{ marginBottom: 0, width: "100%" }}
            >
              <Input placeholder="Company" />
            </Form.Item>,
            <Form.Item name="branch" style={{ marginBottom: 0, width: "100%" }}>
              <Input placeholder="Branch" />
            </Form.Item>,
          ],
        },
      ],
    },
  ];

  return (
    <Card
      title="Trainer Calendar"
      extra={
        <Button onClick={() => setModalVisible(true)}>Add Training</Button>
      }
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      <List
        header={<strong>Scheduled Trainings</strong>}
        bordered
        dataSource={events}
        renderItem={(item) => (
          <List.Item>
            <strong>
              {item.date} {item.time}
            </strong>{" "}
            — {item.topic} ({item.trainer})
          </List.Item>
        )}
      />

      <StepModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddEvent}
        title="Add trainer"
        steps={steps}
        form={form}
      />
    </Card>
  );
};

export default TestCalendar;
