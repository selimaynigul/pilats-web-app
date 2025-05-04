// SchedulerStyles.ts
import { Modal, Popover } from "antd";
import styled from "styled-components";

export const CalendarWrapper = styled.div`
  background: transparent;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .rbc-month-view {
    border: none;
  }
  .rbc-header {
    border: none;
    margin-bottom: 10px;

    span {
      color: #4d3abd;
    }
  }

  .rbc-toolbar button {
    background: none;
    background-image: none;
    border: 1px solid lightgrey;
    padding: 0.375rem 1rem;
    line-height: normal;
    white-space: nowrap;
  }

  .rbc-toolbar button.rbc-active {
    box-shadow: none;
    background-color: #e6e6e6;
    border-color: #adadad;
  }

  .rbc-month-row {
    border: none;
  }

  .rbc-row-bg {
    overflow: none;
  }

  .rbc-now {
    button {
      background: #5d46e5;
      padding: 5px;
      font-size: 10px;
      border-radius: 50px;
      color: white;
    }
  }

  .rbc-button-link {
    color: #4d3abd;
  }

  .rbc-day-bg {
    border-color: #e6e3ff;
  }

  .rbc-off-range-bg {
    background: #e6e3ff;
  }

  .rbc-month-row + .rbc-month-row {
    border-top: none;
  }

  .rbc-ellipsis,
  .rbc-show-more,
  .rbc-row-segment .rbc-event-content,
  .rbc-event-label {
    white-space: nowrap; /* Prevents text from wrapping */
    overflow: hidden; /* Hides the overflowing text */
    text-overflow: ellipsis;
  }

  /* .rbc-event {
  }
 */

  .rbc-event-label {
    display: none;
  }
`;

const test = styled.div`
  .rbc-time-content > * + * > * {
    border: none;
  }

  .rbc-time-content > .rbc-time-gutter {
    background: white; /* sol zaman kolonunu ayrı tut */
  }

  /* 1. gün, 3. gün, 5. gün... */
  .rbc-time-content .rbc-day-slot:nth-child(2n + 1) {
    background-color: #e6e3ff; /* açık mor tonu */
  }

  /* 2. gün, 4. gün... */
  .rbc-time-content .rbc-day-slot:nth-child(2n) {
  }
`;

export const EventTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10; /* Above all content */
  display: flex;
  transition: 0.3s;
  background: ${({ theme }) => theme.contentBg};
  opacity: 0.5;

  justify-content: center;
  align-items: center;
`;

export const MoreButton = styled.div`
  margin-top: 2px;
  margin-bottom: 56px;
  color: #412bc4;
  cursor: pointer;
  text-align: center;
  transition: 0.1s;
`;

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding-bottom: 1px;
    max-width: 400px;
    /*     max-height: 420px;
    overflow-y: scroll; */
  }
`;
