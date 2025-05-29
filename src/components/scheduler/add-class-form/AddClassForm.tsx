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
  message,
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
  ApartmentOutlined,
} from "@ant-design/icons";
import { branchService, trainerService } from "services";
import { getBranchId, getCompanyId, hasRole } from "utils/permissionUtils";

const StyleOverrides = styled.div`
  .trainer-select {
    max-width: 180px;
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
  onSubmit: (values: any) => void;
  selectedRange: { start: Date; end: Date } | null;
  nameRef: React.RefObject<any>;
  currentView: string;
  form: any;
}

const AddClassForm: React.FC<AddClassFormProps> = ({
  visible,
  onSubmit,
  selectedRange,
  nameRef,
  currentView,
  form,
}) => {
  const [repeat, setRepeat] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState("weekly");
  const [showDescription, setShowDescription] = useState(false);
  const [trainerExpanded, setTrainerExpanded] = useState(false);
  const descRef = useRef<any>(null);
  const [trainers, setTrainers] = useState<any>([]);
  const [branchOptions, setBranchOptions] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    const isSingleDay = selectedRange
      ? dayjs(selectedRange.start).isSame(
          dayjs(selectedRange.end).subtract(1, "minute"),
          "day"
        )
      : true;
    setRepeat(!isSingleDay);

    const startTime = selectedRange ? dayjs(selectedRange.start) : null;
    const endTime = selectedRange ? dayjs(selectedRange.end) : null;

    const initialValues: any = {
      startDate: startTime?.startOf("day") || null,
      endDate: !isSingleDay ? endTime : null,
      repeat: !isSingleDay,
    };

    // Eğer month view değilse, saat bilgilerini ekle
    if (selectedRange && currentView !== "month") {
      initialValues.timeRange = [startTime, endTime];
    }

    form.setFieldsValue(initialValues);
  }, [selectedRange, form]);

  useEffect(() => {
    if (hasRole(["COMPANY_ADMIN"])) {
      branchService
        .search({ companyId: getCompanyId() })
        .then((res) => {
          setBranchOptions(res?.data || []);
        })
        .catch(() => {
          message.error("Failed to fetch branches.");
        });
    }
  }, []);

  useEffect(() => {
    trainerService
      .search({})
      .then((res) => {
        setTrainers(res?.data || []);
      })
      .catch(() => {
        message.error("Failed to fetch trainers.");
      });
  }, []);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setRepeat(false);
      setRepeatFrequency("weekly");
      setShowDescription(false);
    }
  }, [visible]);

  const handleBranchChange = (branchId: number) => {
    setSelectedBranch(branchId);
    form.setFieldsValue({ trainer: null });
  };
  const handleFinish = (values: any) => {
    values = { ...values, repeatFrequency };

    const now = dayjs();
    const selectedDate = values.startDate;
    const [startTime, endTime] = values.timeRange || [null, null];

    const startDateTime = selectedDate
      .hour(dayjs(startTime).hour())
      .minute(dayjs(startTime).minute());

    const endDateTime = selectedDate
      .hour(dayjs(endTime).hour())
      .minute(dayjs(endTime).minute());

    if (startDateTime.isBefore(now)) {
      message.warning("Geçmiş bir zaman için ders oluşturulamaz.");
      return;
    }

    if (startDateTime.isSameOrAfter(endDateTime)) {
      message.warning("Dersin başlangıç saati bitiş saatinden önce olmalı.");
      return;
    }

    if (values.repeat) {
      const endDate = values.endDate;
      if (!endDate || !selectedDate) {
        message.warning(
          "Tekrarlayan dersler için geçerli bir bitiş tarihi girin."
        );
        return;
      }

      const diff = dayjs(endDate).diff(selectedDate, "day");

      if (diff < 1) {
        message.warning("End date, start date'ten en az 1 gün sonra olmalı.");
        return;
      }
    }

    onSubmit(values);
    form.resetFields();
    setRepeat(false);
    setRepeatFrequency("weekly");
    setShowDescription(false);
  };

  const dateFormat = (value: dayjs.Dayjs) => value.format("MMMM D, YYYY"); // Custom format
  useEffect(() => {
    if (showDescription) {
      setTimeout(() => {
        descRef.current?.focus();
      }, 0);
    }
  }, [showDescription]);

  const handleTrainerSearch = (value: string) => {
    if (!value) return;

    trainerService
      .search({
        ucSearchRequest: {
          name: value,
        },
        branchId: hasRole(["COMPANY_ADMIN"])
          ? selectedBranch || null
          : getBranchId(),
      })
      .then((res) => {
        setTrainers(res?.data);
      })
      .catch((error) => {
        console.log(error);
        message.error("Error searching trainer");
      });
  };

  const handleBranchSearch = (value: string) => {
    if (!value) return;

    branchService
      .search({
        branchName: value,
      })
      .then((res) => {
        setBranchOptions(res?.data);
      })
      .catch((error) => {
        console.log(error);
        message.error("Error searching branches");
      });
  };

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
              format={dateFormat}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              onChange={(date) => setSelectedDate(date)}
            />
          </Form.Item>
        </div>

        <div
          className="custom-input"
          style={{
            display: "flex",
            alignItems: "start",
          }}
        >
          <CustomIcon style={{ marginTop: 8 }}>
            <ClockCircleOutlined />
          </CustomIcon>
          <Form.Item style={{ width: "100%" }} name="timeRange">
            <TimePicker.RangePicker
              format="HH:mm"
              minuteStep={5}
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
                    disabledMinutes: (hour) =>
                      hour === currentHour
                        ? Array.from({ length: 60 }, (_, i) => i).filter(
                            (min) => min < currentMinute
                          )
                        : [],
                  };
                }

                return {};
              }}
            />
          </Form.Item>
        </div>

        {hasRole(["COMPANY_ADMIN"]) && (
          <div
            className="custom-input"
            style={{
              display: "flex",
              alignItems: "start",
            }}
          >
            <CustomIcon style={{ marginTop: 8 }}>
              <ApartmentOutlined />
            </CustomIcon>
            <Form.Item
              style={{ width: "100%" }}
              name="branch"
              rules={[{ required: true, message: "Please select a branch." }]}
            >
              <Select
                showSearch
                placeholder="Select a branch"
                filterOption={false}
                onSearch={handleBranchSearch}
                onChange={handleBranchChange}
                options={branchOptions.map((branch) => ({
                  value: branch.id,
                  label: branch.branchName,
                }))}
              />
            </Form.Item>
          </div>
        )}
        {(hasRole(["BRANCH_ADMIN"]) || selectedBranch) && (
          <div
            className="custom-input"
            style={{
              display: "flex",
              alignItems: "start",
            }}
          >
            <CustomIcon style={{ marginTop: 8 }}>
              <UserOutlined />
            </CustomIcon>
            <Form.Item
              style={{ width: "100%" }}
              name="trainer"
              rules={formItems.trainer.rules}
              className={
                trainerExpanded ? "trainer-select-expanded" : "trainer-select"
              }
            >
              <Select
                showSearch
                placeholder="Select a trainer"
                onSearch={handleTrainerSearch}
                filterOption={false}
                onFocus={() => setTrainerExpanded(true)}
                onBlur={() => setTrainerExpanded(false)}
              >
                {trainers.map((trainer: any) => {
                  if (trainer.passive) {
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
        )}
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
              <CustomIcon style={{ marginTop: 38 }}>
                <CalendarOutlined />
              </CustomIcon>
              <Form.Item
                style={{ width: "100%" }}
                name="endDate"
                label="End date"
                rules={formItems.endDate.rules}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  suffixIcon={null}
                  placeholder="Select end date"
                  format={dateFormat} // Use custom format function
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
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
