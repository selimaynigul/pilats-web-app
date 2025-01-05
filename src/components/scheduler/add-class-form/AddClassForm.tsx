import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  Radio,
  InputNumber,
  Button,
  TimePicker,
} from "antd";
import { addClassFormItems as formItems } from "./add-class-form-items";
import dayjs from "dayjs";
import styled from "styled-components";
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  AlignLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const StyleOverrides = styled.div`
  .trainer-select {
    width: 200px;
  }

  .trainer-select-expanded {
    width: 100%;
  }

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
const CreateButton = styled(Button)`
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

interface AddClassFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  selectedRange: { start: Date; end: Date } | null;
  nameRef: React.RefObject<any>;
}

const AddClassForm: React.FC<AddClassFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  selectedRange,
  nameRef,
}) => {
  const [form] = Form.useForm();
  const [repeat, setRepeat] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState("weekly");
  const [customDays, setCustomDays] = useState(2);
  const [showDescription, setShowDescription] = useState(false);
  const [trainerExpanded, setTrainerExpanded] = useState(false);
  const descRef = useRef<any>(null);

  useEffect(() => {
    const isSingleDay = selectedRange
      ? dayjs(selectedRange.start).isSame(
          dayjs(selectedRange.end).subtract(1, "minute"),
          "day"
        )
      : true;
    setRepeat(!isSingleDay);
    form.setFieldsValue({
      startDate: selectedRange ? dayjs(selectedRange.start) : null,
      endDate: !isSingleDay ? dayjs(selectedRange?.end) : null,
      repeat: !isSingleDay,
    });
  }, [selectedRange, form]);

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
    setRepeat(false);
    setRepeatFrequency("weekly");
    setCustomDays(2);
    setShowDescription(false);
  };

  const trainerOptions = [
    { label: "Trainer 1", value: "trainer1" },
    { label: "Trainer 2", value: "trainer2" },
  ];
  const dateFormat = (value: dayjs.Dayjs) => value.format("MMMM D, YYYY"); // Custom format
  useEffect(() => {
    if (showDescription) {
      setTimeout(() => {
        descRef.current?.focus();
      }, 0);
    }
  }, [showDescription]);

  /*   // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setShowDescription(false); // Reset `showDescription` when modal closes
      form.resetFields(); // Optionally reset form fields
    }
  }, [visible]); */

  return (
    <StyleOverrides>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        variant="filled"
      >
        <Form.Item name="className" rules={formItems.className.rules}>
          <StyledNameInput ref={nameRef} placeholder="Enter class name" />
        </Form.Item>

        {!showDescription && (
          <Button
            type="link"
            onClick={() => {
              setShowDescription(true);
            }}
            style={{ marginBottom: "16px", padding: 0, marginLeft: 24 }}
          >
            + Add Description
          </Button>
        )}

        {showDescription && (
          <Form.Item name="description" rules={formItems.description.rules}>
            <div
              className="custom-input"
              style={{
                display: "flex",
                alignItems: "start",
              }}
            >
              <CustomIcon>
                <AlignLeftOutlined style={{ marginTop: 5 }} />
              </CustomIcon>
              <Input.TextArea
                rows={3}
                placeholder="Enter description"
                ref={descRef}
              />
            </div>
          </Form.Item>
        )}

        <div
          className="custom-input"
          style={{
            display: "flex",
            alignItems: "start",
          }}
        >
          <CustomIcon style={{ marginTop: 8 }}>
            <CalendarOutlined />
          </CustomIcon>
          <Form.Item
            style={{ width: "100%" }}
            name="startDate"
            rules={formItems.startDate.rules}
          >
            <DatePicker
              style={{ width: "100%" }}
              suffixIcon={null}
              format={dateFormat} // Use custom format function
            />
          </Form.Item>
        </div>

        <Form.Item name="timeRange">
          <div className="custom-input">
            <CustomIcon>
              <ClockCircleOutlined />
            </CustomIcon>
            <TimePicker.RangePicker
              format="HH:mm"
              minuteStep={5}
              style={{ width: "100%" }}
              suffixIcon={null}
            />
          </div>
        </Form.Item>

        <Form.Item
          name="trainer"
          rules={formItems.trainer.rules}
          className={
            trainerExpanded ? "trainer-select-expanded" : "trainer-select"
          }
        >
          <div className="custom-input">
            <CustomIcon>
              <UserOutlined />
            </CustomIcon>
            <Select
              showSearch
              placeholder="Select a trainer"
              options={trainerOptions}
              onFocus={() => setTrainerExpanded(true)}
              onBlur={() => setTrainerExpanded(false)}
            />
          </div>
        </Form.Item>

        <Form.Item
          style={{ marginLeft: 24 }}
          name="repeat"
          valuePropName="checked"
        >
          <Checkbox
            onChange={(e) => {
              setRepeat(e.target.checked);
              form.setFieldsValue({
                repeat: e.target.checked,
                endDate: e.target.checked ? dayjs(selectedRange?.end) : null,
              });
              if (e.target.checked) {
                setRepeatFrequency("weekly");
              }
            }}
          >
            Repeat
          </Checkbox>
        </Form.Item>

        {repeat && (
          <>
            <Form.Item name="repeatFrequency" initialValue="weekly">
              <Radio.Group
                value={repeatFrequency}
                onChange={(e) => setRepeatFrequency(e.target.value)}
              >
                <Radio value="daily">Daily</Radio>
                <Radio value="weekly">Weekly</Radio>
                <Radio value="monthly">Monthly</Radio>
                <Radio value="custom">Custom</Radio>
              </Radio.Group>
            </Form.Item>

            {repeatFrequency === "custom" && (
              <Form.Item
                name="customDays"
                label="Custom Days Interval"
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid number of days",
                  },
                ]}
                initialValue={2} // Default value for customDays
              >
                <InputNumber min={1} />
              </Form.Item>
            )}

            <div
              className="custom-input"
              style={{
                display: "flex",
                alignItems: "start",
              }}
            >
              <CustomIcon style={{ marginTop: 8 }}>
                <CalendarOutlined />
              </CustomIcon>
              <Form.Item
                style={{ width: "100%" }}
                name="endDate"
                rules={formItems.endDate.rules}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  suffixIcon={null}
                  placeholder="Select end date"
                  format={dateFormat} // Use custom format function
                />
              </Form.Item>
            </div>
          </>
        )}

        <Form.Item style={{ textAlign: "end" }}>
          <CreateButton
            key="submit"
            type="primary"
            htmlType="submit"
            shape="round"
            icon={<PlusOutlined />}
          >
            Create
          </CreateButton>
        </Form.Item>
      </Form>
    </StyleOverrides>
  );
};

export default AddClassForm;
