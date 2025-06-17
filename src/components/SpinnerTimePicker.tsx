import { useLanguage } from "hooks";
import React from "react";
import { TimePicker } from "react-ios-time-picker";
import styled from "styled-components";
import dayjs from "dayjs";

const StyleOverrides = styled.div`
  .react-ios-time-picker-input {
    background: #f5f5f5;
    padding: 6px 11px 4px;
    width: 100%;
    height: 40px;

    font-size: 14px;
    line-height: 1;
    border-width: 1px;
    border-style: solid;
    border-color: transparent;
    border-radius: 8px;
    transition:
      border 0.2s,
      box-shadow 0.2s,
      background 0.2s;

    &::placeholder {
      color: #b4b4b4;
    }

    &:hover {
      background: rgba(0, 0, 0, 0.06);
    }
  }
`;

interface SpinnerTimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  placeHolder?: string;
  isOpen?: boolean;
  onSave?: () => void;
}

const SpinnerTimePicker: React.FC<SpinnerTimePickerProps> = ({
  value,
  onChange,
  placeHolder,
  isOpen,
  onSave,
}) => {
  const formattedValue = value
    ? dayjs(value, ["HH:mm", "hh:mm A"]).format("HH:mm")
    : "";

  return (
    <StyleOverrides>
      <TimePicker
        onSave={onSave}
        isOpen={isOpen}
        cancelButtonText="Cancel"
        saveButtonText="Save"
        placeHolder={placeHolder}
        onChange={onChange}
        value={formattedValue || undefined}
      />
    </StyleOverrides>
  );
};

export default SpinnerTimePicker;
