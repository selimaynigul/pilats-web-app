import React from "react";
import { Alert } from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useLanguage } from "hooks";

dayjs.extend(duration);

const EventStatusAlert: React.FC<{ startDate: string; endDate: string }> = ({
  startDate,
  endDate,
}) => {
  const { t, userLanguage } = useLanguage();

  const now = dayjs();
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  let type: "info" | "warning" | "error" = "info";
  let message = "";

  if (now.isBefore(start)) {
    const diff = dayjs.duration(start.diff(now));
    const totalMinutes = diff.asMinutes();

    if (totalMinutes < 1) {
      message = t.startsSoon;
    } else {
      const day = diff.days();
      const hour = diff.hours();
      const minute = diff.minutes();

      const parts = [];
      if (day > 0) parts.push(`${day} ${t.day}`);
      if (hour > 0) parts.push(`${hour} ${t.hour}`);
      if (minute > 0) parts.push(`${minute} ${t.minute}`);

      message =
        userLanguage === "en"
          ? `${t.startsIn} ${parts.join(" ")}.`
          : `${parts.join(" ")} ${t.startsIn}`;
    }

    type = "info";
  } else if (now.isAfter(start) && now.isBefore(end)) {
    message = t.ongoing;
    type = "warning";
  } else if (now.isAfter(end)) {
    message = t.ended;
    type = "error";
  }

  return <Alert message={message} type={type} showIcon />;
};

export default EventStatusAlert;
