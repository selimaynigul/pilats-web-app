// SchedulerStyles.ts
import styled from "styled-components";

export const CalendarWrapper = styled.div`
  background: transparent;
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
`;

export const EventTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
`;
