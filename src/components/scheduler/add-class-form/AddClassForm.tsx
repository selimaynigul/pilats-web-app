import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
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
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  AlignLeftOutlined,
  PlusOutlined,
  ApartmentOutlined,
  SwapRightOutlined,
} from "@ant-design/icons";
import { branchService, trainerService } from "services";
import { getBranchId, getCompanyId, hasRole } from "utils/permissionUtils";
import { useLanguage } from "hooks";
import SpinnerTimePicker from "components/SpinnerTimePicker";
import { isMobile } from "utils/utils";

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

  .ant-input-number-filled {
    width: 100%;
  }

  .ant-input-data-count {
    font-size: 11px !important;
    color: #888;
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

const NameInputStyles = styled.div`
  .ant-input-filled {
    font-weight: 500;
    font-size: 1.1rem;
    color: #333;
  }
  .ant-input-filled.ant-input-status-error:not(.ant-input-disabled) {
    border-radius: 10px;
  }
`;

interface AddClassFormProps {
  visible: boolean;
  onSubmit: (values: any) => void;
  selectedRange: { start: Date; end: Date } | null;
  nameRef: React.RefObject<any>;
  currentView: string;
  form: any;
  ref: any;
}

const AddClassForm: React.FC<AddClassFormProps> = forwardRef((props, ref) => {
  const { onSubmit, selectedRange, nameRef, currentView, form } = props;
  const [repeat, setRepeat] = useState(false);
  const [repeatFrequency, setRepeatFrequency] = useState("weekly");
  const [showDescription, setShowDescription] = useState(false);
  const [trainerExpanded, setTrainerExpanded] = useState(false);
  const descRef = useRef<any>(null);
  const [trainers, setTrainers] = useState<any>([]);
  const [branchOptions, setBranchOptions] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [spinnerTime, setSpinnerTime] = useState<any>([]);

  const { t } = useLanguage();

  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setSelectedBranch(null);
    },
  }));

  useEffect(() => {
    if (selectedBranch || hasRole(["BRANCH_ADMIN"])) {
      trainerService
        .search({
          branchId: hasRole(["COMPANY_ADMIN"]) ? selectedBranch : getBranchId(),
        })
        .then((res) => {
          setTrainers(res?.data || []);
        })
        .catch(() => {
          message.error("Failed to fetch trainers.");
        });
    }
  }, [selectedBranch]);

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

  const handleBranchChange = (branchId: number) => {
    setSelectedBranch(branchId);
    form.setFieldsValue({ trainer: null });
  };

  const handleFinish = (values: any) => {
    values = { ...values, repeatFrequency };

    const now = dayjs();
    const selectedDate = values.startDate;

    let startTime = null;
    let endTime = null;

    if (isMobile()) {
      const [startStr, endStr] = spinnerTime;

      const is12Hour = /AM|PM/i.test(startStr);
      const format = is12Hour ? "YYYY-MM-DD hh:mm A" : "YYYY-MM-DD HH:mm";

      startTime = dayjs(
        `${selectedDate.format("YYYY-MM-DD")} ${startStr}`,
        format
      );
      endTime = dayjs(`${selectedDate.format("YYYY-MM-DD")} ${endStr}`, format);

      values.timeRange = [startTime, endTime];
    } else {
      [startTime, endTime] = values.timeRange || [null, null];
    }

    if (!startTime || !endTime) {
      message.warning("Başlangıç ve bitiş saatleri zorunludur.");
      return;
    }

    const startDateTime = dayjs(selectedDate)
      .hour(dayjs(startTime).hour())
      .minute(dayjs(startTime).minute());

    const repeatEndDate = values.endDate
      ? dayjs(values.endDate)
      : dayjs(selectedDate); // Tekrarsızsa aynı gün olur

    const endDateTime = repeatEndDate
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

    // Zamanları startDate & endDate'e at (formata dahil)
    values.startDate = startDateTime.toISOString();
    values.endDate = endDateTime.toISOString();

    onSubmit(values);
    form.resetFields();
    setRepeat(false);
    setRepeatFrequency("weekly");
    setShowDescription(false);
    setSpinnerTime([]);
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
          <NameInputStyles>
            <StyledNameInput ref={nameRef} placeholder={t.enterClassName} />
          </NameInputStyles>
        </Form.Item>

        {!showDescription && (
          <Button
            type="link"
            onClick={() => {
              setShowDescription(true);
            }}
            style={{ marginBottom: "16px", padding: 0, marginLeft: 24 }}
          >
            + {t.addDescription}
          </Button>
        )}

        {showDescription && (
          <Form.Item name="description">
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
                maxLength={200}
                showCount
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
          <Form.Item
            style={{ width: "100%" }}
            name="timeRange"
            rules={isMobile() ? undefined : formItems.time.rules}
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
                    placeHolder="Start time"
                    value={spinnerTime[0]}
                    onChange={(val) => {
                      setSpinnerTime([val, spinnerTime[1]]);
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
                    placeHolder="End time"
                    value={spinnerTime[1]}
                    onChange={(val) => {
                      setSpinnerTime([spinnerTime[0], val]);
                      form.setFieldValue("endTime", val);
                    }}
                  />
                </Form.Item>
              </SpinnerContainer>
            ) : (
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
            )}
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
                disabled={hasRole(["COMPANY_ADMIN"]) && !selectedBranch}
              >
                {trainers
                  .filter(
                    (trainer: any) =>
                      !selectedBranch || trainer.branchId === selectedBranch // Branch ID eşleşmesi
                  )
                  .map((trainer: any) => (
                    <Select.Option key={trainer.id} value={trainer.id}>
                      {trainer.ucGetResponse.name}{" "}
                      {trainer.ucGetResponse.surname}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <div
              className="custom-input"
              style={{
                display: "flex",
                alignItems: "start",
                marginLeft: 16,
              }}
            >
              <CustomIcon style={{ marginTop: 8 }}>
                <TeamOutlined />
              </CustomIcon>
              <Form.Item
                name="totalCapacity"
                rules={[
                  { required: true, message: "Please enter a quota value." },
                  {
                    type: "number",
                    min: 1,
                    message: "Quota must be at least 1",
                  },
                ]}
                style={{ width: "100%" }}
              >
                <InputNumber placeholder={t.calendar.quota} min={1} step={1} />
              </Form.Item>
            </div>
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
            {t.calendar.repeat}
          </Checkbox>
        </Form.Item>

        {repeat && (
          <>
            <Form.Item name="repeatFrequency" initialValue="weekly">
              <Radio.Group
                value={repeatFrequency}
                onChange={(e) => setRepeatFrequency(e.target.value)}
              >
                <Radio value="daily">{t.calendar.daily}</Radio>
                <Radio value="weekly">{t.calendar.weekly}</Radio>
                <Radio value="monthly">{t.calendar.monthly}</Radio>
                <Radio value="custom">{t.calendar.custom}</Radio>
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
            {t.create}
          </CreateButton>
        </Form.Item>
      </Form>
    </StyleOverrides>
  );
});

export default AddClassForm;
