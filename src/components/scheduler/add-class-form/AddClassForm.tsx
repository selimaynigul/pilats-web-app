// AddClassForm.tsx

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  Radio,
  InputNumber,
  Button,
} from "antd";
import { addClassFormItems as formItems } from "./add-class-form-items";
import dayjs from "dayjs";

interface AddClassFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  selectedRange: { start: Date; end: Date } | null;
}

const AddClassForm: React.FC<AddClassFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  selectedRange,
}) => {
  const [form] = Form.useForm();
  const [repeat, setRepeat] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState("weekly");
  const [customDays, setCustomDays] = useState(2);

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
    console.log(values);
    form.resetFields();
    setRepeat(false);
    setRepeatFrequency("weekly");
    setCustomDays(2);
  };

  const trainerOptions = [
    { label: "Trainer 1", value: "trainer1" },
    { label: "Trainer 2", value: "trainer2" },
  ];

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        name="className"
        label={formItems.className.label}
        rules={formItems.className.rules}
      >
        <Input placeholder="Enter class name" />
      </Form.Item>

      <Form.Item
        name="description"
        label={formItems.description.label}
        rules={formItems.description.rules}
      >
        <Input.TextArea rows={3} placeholder="Enter description" />
      </Form.Item>

      <Form.Item
        name="startDate"
        label={formItems.startDate.label}
        rules={formItems.startDate.rules}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="startTime"
        label={formItems.startTime.label}
        rules={formItems.startTime.rules}
      >
        <DatePicker.TimePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="trainer"
        label={formItems.trainer.label}
        rules={formItems.trainer.rules}
      >
        <Select
          showSearch
          placeholder="Select a trainer"
          options={trainerOptions}
        />
      </Form.Item>

      <Form.Item name="repeat" valuePropName="checked">
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
          <Form.Item
            name="repeatFrequency"
            label="Repeat Frequency"
            initialValue="weekly"
          >
            <Radio.Group
              value={repeatFrequency}
              onChange={(e) => setRepeatFrequency(e.target.value)}
            >
              <Radio value="daily">Every Day</Radio>
              <Radio value="weekly">Every Week</Radio>
              <Radio value="monthly">Every Month</Radio>
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

          <Form.Item
            name="endDate"
            label={formItems.endDate.label}
            rules={formItems.endDate.rules}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </>
      )}

      <Form.Item>
        <Button key="cancel" onClick={onCancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button key="submit" type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddClassForm;
