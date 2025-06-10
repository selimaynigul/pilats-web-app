// SchedulerStyles.ts
import { Modal } from "antd";
import styled from "styled-components";

export const CalendarWrapper = styled.div`
  .calendar-slide-left {
    animation: slideLeft 0.2s ease;
    will-change: transform, opacity;
    animation-fill-mode: both;
  }
  .calendar-slide-right {
    animation: slideRight 0.2s ease;
    will-change: transform, opacity;
    animation-fill-mode: both;
  }

  @keyframes slideLeft {
    from {
      transform: translateX(20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideRight {
    from {
      transform: translateX(-20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  background: transparent;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .rbc-current-time-indicator {
    background: #5d46e5;
    height: 2px;
  }

  .rbc-current-time-indicator::before {
    content: "";
    position: absolute;
    left: -5px; /* Çizginin biraz soluna yerleştir */
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background-color: #5d46e5;
    border-radius: 50%;
  }

  .rbc-month-view {
    border: none;
  }
  .rbc-header {
    border: none;

    color: #4d3abd;
  }

  .rbc-agenda-time-cell,
  .rbc-agenda-date-cell {
    color: #4d3abd;
  }

  .rbc-agenda-view::-webkit-scrollbar {
    width: 6px;
  }

  .rbc-agenda-view::-webkit-scrollbar-track {
    background: transparent;
  }

  .rbc-agenda-view::-webkit-scrollbar-thumb {
    background-color: rgba(93, 70, 229, 0.2);
    border-radius: 3px;
  }

  .rbc-month-header {
    margin-bottom: 10px;
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

  .rbc-button-link > span {
    font-weight: bold;
  }

  .rbc-day-bg {
    border-color: #e6e3ff;
  }

  .rbc-today {
    background: #f6f5ff;
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

  .rbc-row-segment {
    max-height: 28px;
  }
  .rbc-show-more {
    position: absolute;
    top: 28px;
  }

  .rbc-event {
    padding: 0px 2px 2px 2px;
    height: 60px;

    @media (max-width: 1024px) {
      padding: 0;
    }
  }

  .rbc-event-label {
    display: none;
  }

  .rbc-label {
    color: #5d46e5;
  }

  .rbc-time-view .rbc-allday-cell {
    display: none;
  }

  .rbc-slot-selection,
  .rbc-selected-cell {
    background: rgba(94, 70, 229, 0.21);
  }

  .rbc-events-container > * {
    padding: 0px !important;
  }

  .rbc-agenda-content {
    margin-top: 10px;
  }

  .rbc-time-view,
  .rbc-agenda-view .rbc-agenda-table,
  .rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td,
  .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
    border: none;
  }

  .rbc-agenda-view table.rbc-agenda-table tbody > tr > td + td,
  .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
    border-left: 1px solid #e6e3ff;
  }

  .rbc-time-content,
  .rbc-agenda-view {
    border: none;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100vh - 220px);

    @media (max-width: 768px) {
      max-height: calc(100vh - 180px);
    }

    @media (max-width: 480px) {
      max-height: calc(100vh - 180px);
    }
  }

  .rbc-time-header-content {
    border: none;
  }

  .rbc-time-content > .rbc-time-gutter {
    background: transparent;
  }

  .rbc-time-header,
  .rbc-time-gutter,
  .rbc-time-slot,
  .rbc-timeslot-group,
  .rbc-time-header.rbc-overflowing {
    border: none;
    background: transparent;
  }

  /* Alternating vertical backgrounds */
  .rbc-time-content .rbc-day-slot:nth-child(2n + 1) {
    border-right: 1px solid #e6e3ff;
    border-left: 1px solid #e6e3ff;
  }

  /* Alternating horizontal backgrounds */
  .rbc-time-slot:nth-child(2n) {
    background-color: rgba(245, 243, 255, 1);
  }

  .rbc-time-slot:nth-child(2n + 1) {
    background-color: rgba(230, 227, 255, 0.5);
  }

  /* Make left time slot transparent */
  .rbc-time-gutter {
    background: transparent !important;
  }

  .rbc-time-gutter .rbc-timeslot-group {
    background: transparent !important;
  }

  .rbc-time-gutter .rbc-time-slot {
    background: transparent !important;
  }

  // HERE
  /* Ensure header stays fixed while content scrolls */

  .rbc-time-header {
    position: sticky;
    top: 0;
    z-index: 1;
    background: white;
  }

  .rbc-time-content::-webkit-scrollbar {
    width: 6px;
  }

  .rbc-time-content::-webkit-scrollbar-track {
    background: transparent;
  }

  .rbc-time-content::-webkit-scrollbar-thumb {
    background-color: rgba(93, 70, 229, 0.2);
    border-radius: 3px;
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
    cursor: move;
  }
  .ant-modal-body {
    cursor: default;
    background: white;
  }
`;
