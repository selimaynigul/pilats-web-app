import React, { useEffect, useState, useRef, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import CustomEvent from "./event/Event";
import { message, Spin } from "antd";
import AddClassForm from "components/scheduler/add-class-form/AddClassForm";
import CustomToolbar from "components/scheduler/toolbar/scheduler-toolbar";
import {
  CalendarWrapper,
  LoadingOverlay,
  StyledModal,
} from "components/scheduler/SchedulerStyles";
import { sessionService } from "services";
import { getBranchId, getCompanyId, hasRole } from "utils/permissionUtils";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "hooks";
import "moment/locale/tr";
import "moment/locale/en-gb";
import { View } from "react-big-calendar";
import isBetween from "dayjs/plugin/isBetween";
import { start } from "repl";
dayjs.extend(isBetween);

const validViews: View[] = ["month", "week", "day", "agenda"];
const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

type EventDropArgs = {
  event: any;
  start: Date | string;
  end: Date | string;
  isAllDay?: boolean;
};

const Scheduler: React.FC = () => {
  const { date: urlDate } = useParams<{ date?: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const nameInputRef = useRef<any>(null);
  const savedView = localStorage.getItem("savedCalendarView");
  const paramView = searchParams.get("v");
  const initialView: View =
    (paramView &&
      validViews.includes(paramView as View) &&
      (paramView as View)) ||
    (savedView &&
      validViews.includes(savedView as View) &&
      (savedView as View)) ||
    "month";

  const [currentView, setCurrentView] = useState<View>(initialView);
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const { t, userLanguage } = useLanguage();
  const [company, setCompany] = useState<any>({
    companyName: hasRole(["ADMIN"]) ? t.selectCompany : t.selectBranch,
    id: null,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const [visibleRange, setVisibleRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const [date, setDate] = useState<Date>(() => {
    if (
      urlDate &&
      (dayjs(urlDate, "YYYY-MM", true).isValid() ||
        dayjs(urlDate, "YYYY-MM-DD", true).isValid())
    ) {
      return dayjs(urlDate).toDate();
    }
    const savedDate = localStorage.getItem("savedCalendarDate");
    return savedDate ? new Date(savedDate) : new Date();
  });

  const params = useMemo(() => {
    const isAdmin = hasRole(["ADMIN"]);
    return {
      companyId: isAdmin
        ? company?.branchName
          ? company?.companyId
          : company?.id
        : getCompanyId(),
      branchId: company.branchName ? company.id : null,
      searchByPageDto: {
        pageSize: 200,
      },
    };
  }, [company]);

  useEffect(() => {
    if (userLanguage === "tr") {
      moment.locale("tr");
    } else {
      moment.locale("en-gb");
    }
  }, [userLanguage]);

  const messages = useMemo(
    () => ({
      showMore: (count: any) => `+${count} ${t.more}`,
      today: t.today || "Today",
      month: t.month || "Month",
      week: t.week || "Week",
      day: t.day || "Day",
      agenda: t.agenda || "Agenda",
      date: t.date || "Date",
      time: t.time || "Time",
      event: t.event || "Event",
      allDay: t.allDay || "All Day",
      noEventsInRange: t.noEventsInRange || "No events in range.",
    }),
    [t]
  );

  useEffect(() => {
    const viewParam = searchParams.get("v");

    // Eğer urlDate hiç yoksa ve geçerli bir view varsa, bugünün tarihine yönlendir
    if (!urlDate && viewParam && validViews.includes(viewParam as View)) {
      const today = dayjs().format(
        viewParam === "day" ? "YYYY-MM-DD" : "YYYY-MM"
      );
      const newParams = new URLSearchParams(searchParams.toString());
      navigate({
        pathname: `/sessions/${today}`,
        search: `?${newParams.toString()}`,
      });
      return;
    }

    if (urlDate) {
      const isValidDate =
        dayjs(urlDate, "YYYY-MM", true).isValid() ||
        dayjs(urlDate, "YYYY-MM-DD", true).isValid();

      if (!isValidDate) {
        console.warn("Geçersiz tarih:", urlDate);

        const newParams = new URLSearchParams(searchParams.toString());
        navigate({
          pathname: `/sessions`,
          search: `?${newParams.toString()}`,
        });
        return;
      }

      // Eğer month veya agenda view'dayız ve urlDate YYYY-MM-DD ise, sadece YYYY-MM'e indir
      if (
        (currentView === "month" || currentView === "agenda") &&
        dayjs(urlDate, "YYYY-MM-DD", true).isValid() &&
        (viewParam === "month" || viewParam === "agenda")
      ) {
        const monthUrl = urlDate.slice(0, 7); // YYYY-MM
        const newParams = new URLSearchParams(searchParams.toString());
        navigate({
          pathname: `/sessions/${monthUrl}`,
          search: `?${newParams.toString()}`,
        });
        return;
      }

      // Eğer week view'dayız ve urlDate YYYY-MM-DD ise (ve v=week), aynen bırak
      if (
        currentView === "week" &&
        dayjs(urlDate, "YYYY-MM-DD", true).isValid() &&
        viewParam === "week"
      ) {
        return;
      }

      // Eğer day view'dayız ve urlDate YYYY-MM formatındaysa, ilk güne git
      if (currentView === "day" && dayjs(urlDate, "YYYY-MM", true).isValid()) {
        const firstDay = dayjs(urlDate, "YYYY-MM")
          .startOf("month")
          .format("YYYY-MM-DD");
        const newParams = new URLSearchParams(searchParams.toString());
        navigate({
          pathname: `/sessions/${firstDay}`,
          search: `?${newParams.toString()}`,
        });
        setDate(dayjs(firstDay).toDate());
        return;
      }
    }
  }, [currentView]);

  useEffect(() => {
    if (date) {
      const start: Date = dayjs(date)
        .startOf("month")
        .subtract(7, "day")
        .toDate();
      const end: Date = dayjs(date).endOf("month").add(7, "day").toDate();
      setVisibleRange({ start, end });
    }
  }, [date]);

  useEffect(() => {
    if (visibleRange) {
      fetchSessions(visibleRange.start, visibleRange.end, true);
    }
  }, [visibleRange, params]);

  const updateVisibleDate = (range: { start: Date; end: Date } | Date[]) => {
    console.log("Updating visible date range:", range);
    const startDate = Array.isArray(range) ? range[0] : range.start;
    const endDate = Array.isArray(range) ? range[range.length - 1] : range.end;

    let middleDate: Date;

    if (currentView === "agenda") {
      const today = dayjs();
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      let targetMonth: dayjs.Dayjs;

      if (today.isBetween(start, end, "day", "[]")) {
        targetMonth = today.startOf("month"); // today clicked
      } else if (start.isBefore(dayjs(date), "month")) {
        targetMonth = dayjs(date).subtract(1, "month").startOf("month"); // prev clicked
      } else if (start.isAfter(dayjs(date), "month")) {
        targetMonth = dayjs(date).add(1, "month").startOf("month"); // next clicked
      } else {
        targetMonth = dayjs(date).startOf("month"); // fallback
      }

      middleDate = targetMonth.date(1).startOf("day").toDate();
    } else {
      middleDate = new Date(
        (new Date(startDate).getTime() + new Date(endDate).getTime()) / 2
      );
    }

    setDate(middleDate);
    setSessions([]);
    localStorage.setItem("savedCalendarDate", middleDate.toISOString());

    const newParams = new URLSearchParams(searchParams.toString());

    let urlDate;
    if (currentView === "day") {
      urlDate = dayjs(middleDate).format("YYYY-MM-DD");
    } else {
      urlDate = dayjs(middleDate).format("YYYY-MM");
    }

    navigate({
      pathname: `/sessions/${urlDate}`,
      search: `?${newParams.toString()}`,
    });
  };

  const fetchSessions = (
    startDate: Date,
    endDate: Date,
    showLoading: boolean
  ) => {
    if (showLoading) setLoading(true);

    const finalParams = {
      ...params,
      startDate: dayjs(startDate).toISOString(),
      endDate: dayjs(endDate).toISOString(),
    };

    sessionService
      .search(finalParams)
      .then((response) => {
        const formattedSessions = response.data.map((session: any) => ({
          ...session,
          start: new Date(session.startDate),
          end: new Date(session.endDate),
        }));
        setSessions(formattedSessions);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        message.error("Failed to load events.");
      })
      .finally(() => {
        if (showLoading) setLoading(false);
      });
  };

  const selectSlot = (slotInfo: { start: Date; end: Date }) => {
    if (loading) return;

    const now = new Date();
    const selectedStart = new Date(slotInfo.start);

    // Tarih kontrolü: Bugünün öncesi ise engelle
    if (selectedStart < new Date(now.setHours(0, 0, 0, 0))) {
      message.warning("Geçmiş tarihler seçilemez.");
      return;
    }

    if (hasRole(["BRANCH_ADMIN"])) {
      setSelectedRange(slotInfo);
      setIsModalVisible(true);
    }
  };

  const addSession = (values: any) => {
    setLoading(true);

    const [startTime, endTime] = values.timeRange || [null, null];

    const payload = {
      name: values.className,
      description: values.description || "No description provided.",
      startDate: dayjs(values.startDate)
        .hour(dayjs(startTime).hour())
        .minute(dayjs(startTime).minute())
        .format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(values.startDate)
        .hour(dayjs(endTime).hour())
        .minute(dayjs(endTime).minute())
        .format("YYYY-MM-DDTHH:mm:ss"),
      branchId: hasRole(["COMPANY_ADMIN"]) ? values.branch : getBranchId(),
      trainerId: values.trainer,
      isRepeat: values.repeat || false,
      repeatDay:
        values.repeatFrequency === "weekly"
          ? 7
          : values.repeatFrequency === "monthly"
            ? 30
            : values.repeatFrequency === "custom"
              ? values.customDays
              : 1, // Days between repeats
      repeatEndDate: values.endDate
        ? dayjs(values.endDate).format("YYYY-MM-DD")
        : null,
    };

    sessionService
      .add(payload)
      .then(() => {
        message.success("Event added successfully!");
        if (visibleRange) {
          fetchSessions(visibleRange.start, visibleRange.end, true);
        }
      })
      .catch((error) => {
        console.error("Failed to add event:", error);
        message.error("Failed to add event. Please try again.");
      })
      .finally(() => {
        setLoading(false); // Stop loading
        setIsModalVisible(false); // Close the modal
      });
  };

  const moveSession = ({ event, start, end }: EventDropArgs) => {
    const now = dayjs();
    const originalStart = dayjs(event.start);
    const newStart = dayjs(start);

    // 1. Geçmiş bir dersi taşıma
    if (originalStart.isBefore(now, "minute")) {
      message.warning("Geçmişteki bir dersi taşıyamazsınız.");
      return;
    }

    // 2. Dersi geçmiş bir tarihe taşıma
    if (newStart.isBefore(now, "day")) {
      message.warning("Bir dersi geçmiş bir tarihe taşıyamazsınız.");
      return;
    }

    // 3. Dersi bugüne taşıyorsak ve başlangıç saati şu anki saatten önceyse uyarı ver
    // 3. Ders bugüne taşınıyorsa ve başlangıç saati şu anki saatten önceyse taşıma
    if (
      newStart.isSame(now, "day") &&
      newStart.isBefore(now, "minute") // saniye hassasiyetini önlemek için "minute"
    ) {
      message.warning(
        "Bir dersi bugüne taşıyorsanız, başlangıç saati şu anki saatten sonra olmalıdır."
      );
      return;
    }

    const updatedSession = {
      ...event,
      startDate: dayjs(start).format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(end).format("YYYY-MM-DDTHH:mm:ss"),
      start: new Date(start),
      end: new Date(end),
    };

    setSessions((prev) =>
      prev.map((e) => (e.id === event.id ? updatedSession : e))
    );

    sessionService
      .update({
        ...event,
        startDate: dayjs(start).format("YYYY-MM-DDTHH:mm:ss"),
        endDate: dayjs(end).format("YYYY-MM-DDTHH:mm:ss"),
      })
      .then(() => {
        if (visibleRange) {
          fetchSessions(visibleRange.start, visibleRange.end, false);
        }
      })
      .catch((error) => {
        message.error("Failed to update event. Please try again.");
        setSessions((prev) => prev.map((e) => (e.id === event.id ? event : e)));
      });
  };

  const eventPropGetter = (event: any) => {
    if (currentView === "week" || currentView === "day") {
      return {
        style: {
          background: "transparent",
          border: "none",
          color: "#fff",
          borderRadius: "15px",
        },
      };
    }

    return {
      style: {
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
      },
    };
  };

  const handleViewChange = (view: View) => {
    localStorage.setItem("savedCalendarView", view);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("v", view);
    setSearchParams(newParams);
    setCurrentView(view);

    if (view === "agenda") {
      // mevcut date ne olursa olsun ayın 1'ine çek
      const startOfMonth = dayjs(date).startOf("month").toDate();
      setDate(startOfMonth);
    }
  };

  const getDaySessions = (date: Date | string) => {
    const validDate = typeof date === "string" ? new Date(date) : date;

    const dayStart = new Date(validDate.setHours(0, 0, 0, 0));
    const dayEnd = new Date(validDate.setHours(23, 59, 59, 999));

    return sessions.filter(
      (session) => session.start >= dayStart && session.start <= dayEnd
    );
  };

  return (
    <CalendarWrapper>
      {loading && (
        <LoadingOverlay>
          <Spin tip="Loading..." />
        </LoadingOverlay>
      )}
      <DragAndDropCalendar
        popup
        date={date}
        view={currentView}
        draggableAccessor={() => hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"])}
        events={sessions}
        localizer={localizer}
        selectable={hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"])}
        onSelectSlot={selectSlot}
        onEventDrop={moveSession}
        resizable={false}
        messages={messages}
        style={{ height: 700 }}
        length={dayjs(date).daysInMonth()}
        onRangeChange={updateVisibleDate}
        scrollToTime={
          ["day", "week"].includes(currentView)
            ? (() => {
                const now = new Date();
                // scroll to 4 hours before the current time if the view is day or week
                const scrollHour = Math.max(now.getHours() - 4, 0);
                return new Date(1970, 1, 1, scrollHour, 0, 0);
              })()
            : undefined
        }
        components={{
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              setCompany={setCompany}
              company={company}
              setIsModalVisible={setIsModalVisible}
              onView={handleViewChange}
            />
          ),
          event: ({ event }: { event: any }) => {
            const dayEvents = getDaySessions(event.startDate);
            const showTime = dayEvents.length <= 1;

            return (
              <CustomEvent
                event={event}
                dayEvents={dayEvents}
                showTime={showTime}
                fetch={() => {
                  if (visibleRange) {
                    return fetchSessions(
                      visibleRange.start,
                      visibleRange.end,
                      true
                    );
                  }
                }}
              />
            );
          },
        }}
        eventPropGetter={eventPropGetter}
      />

      <StyledModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        closable={false}
        afterOpenChange={(open) => {
          if (open) {
            nameInputRef.current?.focus();
          }
        }}
      >
        <AddClassForm
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={addSession}
          selectedRange={selectedRange}
          nameRef={nameInputRef}
        />
      </StyledModal>
    </CalendarWrapper>
  );
};

export default Scheduler;
