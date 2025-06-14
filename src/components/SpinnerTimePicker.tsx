import { message } from "antd";
import { useLanguage } from "hooks";
import React from "react";
import { TimePicker } from "react-ios-time-picker";
import styled from "styled-components";

const StyleOverrides = styled.div`
  .react-ios-time-picker-input {
    background: #f5f5f5;
    padding: 6px 11px 4px;
    width: 100%;

    font-size: 14px;
    line-height: 1;
    border-width: 1px;
    border-style: solid;
    border-color: transparent;
    border-radius: 6px;
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
  value?: string | null; // Örnek: "12:00 PM"
  onChange?: (time: string) => void;
  placeHolder?: string;
  isOpen?: boolean;
  onSave?: () => void;
}

const SpinnerTimePicker: React.FC<SpinnerTimePickerProps> = ({
  value = null,
  onChange,
  placeHolder,
  isOpen,
  onSave,
}) => {
  const { userLanguage } = useLanguage();

  return (
    <StyleOverrides>
      <TimePicker
        onSave={onSave}
        isOpen={isOpen}
        cancelButtonText="Cancel"
        saveButtonText="Save"
        placeHolder={placeHolder}
        onChange={onChange}
        value={value}
        use12Hours={userLanguage === "en"}
      />
    </StyleOverrides>
  );
};

export default SpinnerTimePicker;
