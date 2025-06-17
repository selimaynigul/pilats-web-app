import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  TimePicker,
  Button,
  message,
} from "antd";
import styled from "styled-components";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  AlignLeftOutlined,
  SaveOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { sessionService, trainerService } from "services";
import { getBranchId } from "utils/permissionUtils";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { isMobile } from "utils/utils";
import SpinnerTimePicker from "components/SpinnerTimePicker";
dayjs.extend(isSameOrAfter);

const StyleOverrides = styled.div`
  .custom-input {
    display: flex;
    align-items: center;
    .custom-prefix-icon {
      margin-right: 8px;
    }
    input {
      flex: 1;
    }
  }
`;

const CustomIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  color: gray;
  font-size: 16px;
`;

const SaveButton = styled(Button)`
  background: ${(props) => props.theme.primary};
  height: 40px;
  width: 100px;
`;

const StyledNameInput = styled(Input)`
  background: transparent;
  border-bottom: 1px solid lightgrey;
  border-radius: 0;

  &:focus {
    border: none;
    border-bottom: 1px solid ${(props) => props.theme.primary};
  }
`;

const SpinnerContainer = styled.span`
  display: flex;
  padding-bottom: 2px;
  background: #f5f5f5;
  border-radius: 8px;

  &:first-child > div:last-child {
    /*  border-left: 1px solid rgb(216, 216, 216); */
  }
`;

interface EditSessionFormProps {
  session: any;
  onClose: () => void;
  onUpdated: () => void;
  visible: boolean;
}

const EditSessionForm: React.FC<EditSessionFormProps> = ({
  session,
  onClose,
  onUpdated,
  visible,
}) => {
  const [form] = Form.useForm();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [trainerExpanded, setTrainerExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(
    dayjs(session.startDate)
  );
  const [initialFormValues, setInitialFormValues] = useState<any>({});

  useEffect(() => {
    if (session) {
      const start = dayjs(session.startDate);
      const end = dayjs(session.endDate);

      const initial = {
        name: session.name,
        description: session.description,
        date: start,
        timeRange: [start, end],
        startTime: start.format("HH:mm"),
        endTime: end.format("HH:mm"),
        trainer: {
          value: session.trainerId,
          label: `${session.trainerName} ${session.trainerSurname}`,
        },
      };

      setInitialFormValues(initial);
      form.setFieldsValue(initial);
      setSelectedDate(start);
    }
  }, [session]);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setInitialFormValues({});
    }
  }, [visible]);

  useEffect(() => {
    if (trainerExpanded) {
      fetchTrainers("");
    }
  }, [trainerExpanded]);

  const fetchTrainers = (searchValue: string) => {
    trainerService
      .search({
        ucSearchRequest: { name: searchValue, branchId: getBranchId() },
      })
      .then((res) => {
        setTrainers(res?.data);
      })
      .catch(() => {
        message.error("Failed to fetch trainers.");
      });
  };

  const handleSubmit = (values: any) => {
    let startTime, endTime;
    if (isMobile()) {
      startTime = values.startTime || null;
      endTime = values.endTime || null;
    } else {
      startTime = values.timeRange?.[0] || null;
      endTime = values.timeRange?.[1] || null;
    }

    // Mobilde gelen string’i Dayjs’e çevir
    const parseTime = (t: any) =>
      dayjs.isDayjs(t) ? t : dayjs(t, ["HH:mm", "hh:mm A"], true);

    startTime = parseTime(startTime);
    endTime = parseTime(endTime);

    const newDate = dayjs(values.date);
    const originalDate = dayjs(session.startDate);
    const now = dayjs();

    // Tarih + saatleri birleştir
    const startDateTime = newDate
      .hour(startTime.hour())
      .minute(startTime.minute());

    const endDateTime = newDate.hour(endTime.hour()).minute(endTime.minute());

    // 1. Başlangıç zamanı geçmişte mi?
    if (startDateTime.isBefore(now)) {
      message.warning("Ders zamanı geçmişte olamaz.");
      return;
    }

    // 2. Başlangıç saati bitişten sonra mı?
    if (startDateTime.isSameOrAfter(endDateTime)) {
      message.warning("Başlangıç saati, bitiş saatinden önce olmalı.");
      return;
    }

    // 3. Tarih ileri bir günden bugüne taşınıyorsa ve saat şu anın öncesindeyse
    const wasFuture = originalDate.isAfter(now, "day");
    const isTodayNow = newDate.isSame(now, "day");
    if (wasFuture && isTodayNow && startDateTime.isBefore(now)) {
      message.warning(
        "Dersi bugüne taşıdığınız için, başlangıç saatinin şu anki saatten sonra olması gerekir."
      );
      return;
    }

    const payload = {
      id: session.id,
      name: values.name,
      description: values.description,
      startDate: startDateTime
        .second(0)
        .millisecond(0)
        .format("YYYY-MM-DDTHH:mm:ss"),
      endDate: endDateTime
        .second(0)
        .millisecond(0)
        .format("YYYY-MM-DDTHH:mm:ss"),
      trainerId: values.trainer.value,
    };

    sessionService
      .update(payload)
      .then(() => {
        message.success("Session updated successfully!");
        onUpdated();
        onClose();
      })
      .catch((error) => {
        message.error("Failed to update session.");
        console.error("Update error:", error);
      });
  };

  const dateFormat = (value: dayjs.Dayjs) => value.format("MMMM D, YYYY");
  return (
    <StyleOverrides>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        variant="filled"
        initialValues={initialFormValues}
      >
        {/* Class Name */}
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter the session name" }]}
        >
          <StyledNameInput placeholder="Enter session name" />
        </Form.Item>

        {/* Description */}
        <Form.Item /* dış Item yalnızca düzen amaçlı */>
          <div
            className="custom-input"
            style={{ display: "flex", alignItems: "start" }}
          >
            <CustomIcon style={{ marginTop: 5 }}>
              <AlignLeftOutlined />
            </CustomIcon>

            {/* asıl kontrollü alan */}
            <Form.Item
              name="description"
              noStyle /* UI’yi etkilemez                */
              rules={[{ required: false, message: "Enter description" }]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter description"
                maxLength={200}
                showCount
              />
            </Form.Item>
          </div>
        </Form.Item>

        {/* Date Selector */}
        <div
          className="custom-input"
          style={{ display: "flex", alignItems: "start" }}
        >
          <CustomIcon style={{ marginTop: 8 }}>
            <CalendarOutlined />
          </CustomIcon>
          <Form.Item
            style={{ width: "100%" }}
            name="date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              suffixIcon={null}
              format={dateFormat}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              onChange={(value) => setSelectedDate(value!)}
            />
          </Form.Item>
        </div>

        {/* Time Range Selector */}
        <div
          className="custom-input"
          style={{ display: "flex", alignItems: "start" }}
        >
          <CustomIcon style={{ marginTop: 8 }}>
            <ClockCircleOutlined />
          </CustomIcon>
          <Form.Item
            style={{ width: "100%" }}
            name="timeRange"
            rules={[
              {
                required: true,
                message: "Please select the start and end time",
              },
            ]}
          >
            {isMobile() ? (
              <SpinnerContainer>
                <Form.Item
                  noStyle
                  name="startTime"
                  rules={[
                    {
                      required: true,
                      message: "Başlangıç saati zorunlu",
                    },
                  ]}
                  getValueFromEvent={(v) => v}
                >
                  <SpinnerTimePicker
                    key={initialFormValues.startTime || "start-empty"}
                    placeHolder="Start time"
                    value={initialFormValues.startTime}
                    onChange={(val: any) => {
                      form.setFieldValue("startTime", val);
                    }}
                  />
                </Form.Item>
                <SwapRightOutlined
                  style={{
                    color: "#B4B4B4",
                    fontSize: 16,
                    marginTop: 1,
                  }}
                />

                <Form.Item
                  noStyle
                  name="endTime"
                  rules={[{ required: true, message: "Bitiş saati zorunlu" }]}
                  getValueFromEvent={(v) => v}
                >
                  <SpinnerTimePicker
                    key={initialFormValues.endTime || "end-empty"}
                    placeHolder="End time"
                    value={initialFormValues.endTime}
                    onChange={(val: any) => {
                      form.setFieldValue("endTime", val);
                    }}
                  />
                </Form.Item>
              </SpinnerContainer>
            ) : (
              <TimePicker.RangePicker
                format="HH:mm"
                style={{ width: "100%" }}
                suffixIcon={null}
                disabledTime={() => {
                  if (!selectedDate) return {};

                  const isToday = selectedDate.isSame(dayjs(), "day");

                  if (isToday) {
                    const currentHour = dayjs().hour();
                    const currentMinute = dayjs().minute();

                    return {
                      disabledHours: () =>
                        Array.from({ length: 24 }, (_, i) => i).filter(
                          (hour) => hour < currentHour
                        ),
                      disabledMinutes: (selectedHour: number) =>
                        selectedHour === currentHour
                          ? Array.from({ length: 60 }, (_, i) => i).filter(
                              (min) => min < currentMinute
                            )
                          : [],
                    };
                  }

                  return {};
                }}
              />
            )}
          </Form.Item>
        </div>

        {/* Trainer Selector */}
        <div
          className="custom-input"
          style={{ display: "flex", alignItems: "start" }}
        >
          <CustomIcon style={{ marginTop: 8 }}>
            <UserOutlined />
          </CustomIcon>
          <Form.Item
            style={{ width: "100%" }}
            name="trainer"
            rules={[{ required: true, message: "Please select a trainer" }]}
          >
            <Select
              showSearch
              placeholder="Select a trainer"
              labelInValue
              onSearch={fetchTrainers}
              filterOption={false}
              onFocus={() => setTrainerExpanded(true)}
              onBlur={() => setTrainerExpanded(false)}
            >
              {trainers.map((trainer: any) => {
                if (trainer.branchName === session.branchName) {
                  return (
                    <Select.Option key={trainer.id} value={trainer.id}>
                      {trainer.ucGetResponse.name}{" "}
                      {trainer.ucGetResponse.surname}
                    </Select.Option>
                  );
                }
              })}
            </Select>
          </Form.Item>
        </div>

        {/* Submit Button */}
        <Form.Item style={{ textAlign: "end" }}>
          <SaveButton
            key="submit"
            type="primary"
            htmlType="submit"
            shape="round"
            icon={<SaveOutlined />}
          >
            Save
          </SaveButton>
        </Form.Item>
      </Form>
    </StyleOverrides>
  );
};

export default EditSessionForm;
