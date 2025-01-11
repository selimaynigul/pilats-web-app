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
} from "@ant-design/icons";
import dayjs from "dayjs";
import { sessionService, trainerService } from "services";
import { getBranchId } from "utils/permissionUtils";

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

interface EditSessionFormProps {
  session: any;
  onClose: () => void;
  onUpdated: () => void;
}

const EditSessionForm: React.FC<EditSessionFormProps> = ({
  session,
  onClose,
  onUpdated,
}) => {
  const [form] = Form.useForm();
  const [trainers, setTrainers] = useState<any[]>([]);
  const [trainerExpanded, setTrainerExpanded] = useState(false);

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
    const [startTime, endTime] = values.timeRange || [null, null];

    const payload = {
      id: session.id,
      name: values.name,
      description: values.description,
      startDate: dayjs(values.date)
        .hour(dayjs(startTime).hour())
        .minute(dayjs(startTime).minute())
        .second(0)
        .millisecond(0)
        .format("YYYY-MM-DDTHH:mm:ss"), // Explicitly format as ISO 8601
      endDate: dayjs(values.date)
        .hour(dayjs(endTime).hour())
        .minute(dayjs(endTime).minute())
        .second(0)
        .millisecond(0)
        .format("YYYY-MM-DDTHH:mm:ss"),
      trainerId: values.trainer.value,
    };

    console.log(payload);
    console.log("current", values.trainer);

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
  const dateFormat = (value: dayjs.Dayjs) => value.format("MMMM D, YYYY"); // Custom format

  return (
    <StyleOverrides>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        variant="filled"
        initialValues={{
          name: session.name,
          description: session.description,
          date: dayjs(session.startDate),
          timeRange: [dayjs(session.startDate), dayjs(session.endDate)],
          trainer: {
            value: session.trainerId,
            label: `${session.trainerName} ${session.trainerSurname}`,
          },
        }}
      >
        {/* Class Name */}
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please enter the session name" }]}
        >
          <StyledNameInput placeholder="Enter session name" />
        </Form.Item>

        {/* Description */}
        <Form.Item name="description">
          <div
            className="custom-input"
            style={{ display: "flex", alignItems: "start" }}
          >
            <CustomIcon>
              <AlignLeftOutlined style={{ marginTop: 5 }} />
            </CustomIcon>
            <Input.TextArea rows={3} placeholder="Enter description" />
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
            <TimePicker.RangePicker
              format="HH:mm"
              style={{ width: "100%" }}
              suffixIcon={null}
            />
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
