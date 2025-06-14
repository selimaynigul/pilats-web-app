import React, { useEffect, useState, useRef, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import CustomEvent from "./event/Event";
import { Form, message, Modal } from "antd";
import AddClassForm from "components/scheduler/add-class-form/AddClassForm";
import CustomToolbar from "components/scheduler/toolbar/scheduler-toolbar";
import {
  CalendarWrapper,
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
import Draggable from "react-draggable";
import type { DraggableEvent, DraggableData } from "react-draggable";
import EditSessionForm from "./edit-session-form/edit-session-form";
import EventDrawer from "./event/EventDrawer";
import EventPopover from "./event/event-popover/EventPopover";
import { useSwipe } from "hooks";
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

const Scheduler: React.FC<{
  selectedCompany: any;
  setSelectedCompany: any;
}> = ({ selectedCompany, setSelectedCompany }) => {
  const isMobile = useMemo(() => window.innerWidth <= 768, []);
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
  const [cachedSessions, setCachedSessions] = useState<Map<string, any[]>>(
    new Map()
  );

  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const { t, userLanguage } = useLanguage();
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left"
  );

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);

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

  const draggleRef = useRef<HTMLDivElement>(null!);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const getCacheKey = (start: Date, end: Date, params: any) => {
    const baseKey = `${dayjs(start).format("YYYY-MM-DD")}_${dayjs(end).format("YYYY-MM-DD")}`;
    const filterKey = JSON.stringify({
      companyId: params.companyId,
      branchId: params.branchId,
    });
    return `${baseKey}__${filterKey}`;
  };

  const params = useMemo(() => {
    const isAdmin = hasRole(["ADMIN"]);
    return {
      companyId: isAdmin
        ? selectedCompany?.branchName
          ? selectedCompany?.companyId
          : selectedCompany?.id
        : getCompanyId(),
      branchId: selectedCompany.companyParam
        ? selectedCompany.branchParam ||
          (selectedCompany.branchName ? selectedCompany.id : null)
        : selectedCompany.branchName
          ? selectedCompany.id
          : null,
      searchByPageDto: {
        pageSize: 200,
      },
    };
  }, [selectedCompany]);

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
      noEventsInRange: t.noEventsInRange || "",
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
        const firstDay = dayjs(urlDate, "YYYY-MM").startOf("month").toDate();
        const newParams = new URLSearchParams(searchParams.toString());
        navigate({
          pathname: `/sessions/${dayjs(firstDay).format("YYYY-MM-DD")}`,
          search: `?${newParams.toString()}`,
        });
        goToDate(firstDay);
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
      fetchSessions(visibleRange.start, visibleRange.end, true, false);
    }
  }, [visibleRange, params]);

  // Scheduler.tsx
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && !drawerVisible) {
      /* 1) ID takvimdeki veriler içindeyse hemen aç */
      const found = sessions.find((s) => String(s.id) === id);
      if (found) {
        setSelectedSession(found);
        setDrawerVisible(true);
      } else {
        /* 2) Henüz gelmediyse, Drawer’ı boş aç → Drawer fetch eder */
        setSelectedSession(null);
        setDrawerVisible(true);
      }
    }
  }, [searchParams, sessions, drawerVisible]);

  const updateVisibleDate = (range: { start: Date; end: Date } | Date[]) => {
    const startDate = Array.isArray(range) ? range[0] : range.start;
    const endDate = Array.isArray(range) ? range[range.length - 1] : range.end;

    let middleDate: Date;

    if (currentView === "agenda") {
      const monthsDiff = Math.abs(dayjs(startDate).diff(dayjs(date), "month"));
      if (monthsDiff >= 2) {
        middleDate = dayjs(startDate).startOf("month").toDate();
      } else {
        const today = dayjs();
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        let targetMonth = today.isBetween(start, end, "day", "[]")
          ? today.startOf("month")
          : start.isBefore(dayjs(date), "month")
            ? dayjs(date).subtract(1, "month").startOf("month")
            : dayjs(date).add(1, "month").startOf("month");

        middleDate = targetMonth.toDate();
      }
    } else {
      middleDate = new Date((+new Date(startDate) + +new Date(endDate)) / 2);
    }

    if (!cachedSessions.has(getCacheKey(startDate, endDate, params))) {
      setSessions([]); // sadece eğer yoksa temizle
    }
  };

  const formatSessions = (data: any[]): any[] =>
    data.map((session: any) => ({
      ...session,
      start: new Date(session.startDate),
      end: new Date(session.endDate),
    }));

  const updateCache = (key: string, data: any[]) => {
    setCachedSessions((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, data);

      if (newMap.size > 3) {
        const oldestKey = newMap.keys().next().value;
        if (oldestKey !== undefined) {
          newMap.delete(oldestKey);
        }
      }

      return newMap;
    });
  };

  const fetchFreshSessions = async (
    key: string,
    startDate: Date,
    endDate: Date,
    showLoading = true
  ) => {
    if (showLoading) setLoading(true);

    try {
      const response = await sessionService.search({
        ...params,
        startDate: dayjs(startDate).toISOString(),
        endDate: dayjs(endDate).toISOString(),
      });

      const formatted = formatSessions(response.data);
      setSessions(formatted);
      updateCache(key, formatted);
    } catch (error) {
      console.error("Error fetching events:", error);
      message.error("Failed to load events.");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchSessions = async (
    startDate: Date,
    endDate: Date,
    showLoading: boolean,
    ignoreCache: boolean
  ) => {
    const key = getCacheKey(startDate, endDate, params);
    const cached = cachedSessions.get(key);

    if (!ignoreCache && cached) {
      setSessions(cached);

      // Sessiz fetch
      sessionService
        .search({
          ...params,
          startDate: dayjs(startDate).toISOString(),
          endDate: dayjs(endDate).toISOString(),
        })
        .then((res) => {
          const freshData = formatSessions(res.data);

          const isDifferent =
            JSON.stringify(freshData) !== JSON.stringify(cached);

          if (isDifferent) {
            setSessions(freshData);
            updateCache(key, freshData);
          }
        })
        .catch((err) => {
          console.error("Silent fetch failed:", err);
        });

      return;
    }

    // Cache yoksa veya ignore edilmişse doğrudan çek
    await fetchFreshSessions(key, startDate, endDate, showLoading);
  };

  const selectSlot = (slotInfo: { start: Date; end: Date }) => {
    if (loading) return;

    const now = new Date();
    const selectedStart = new Date(slotInfo.start);

    const nowDay = dayjs(now);
    const startDay = dayjs(selectedStart);

    // 🔒 1. Geçmiş gün kontrolü
    if (startDay.isBefore(nowDay.startOf("day"))) {
      message.warning("Geçmiş tarihler seçilemez.");
      return;
    }

    // ⏳ 2. Aynı günse ve saat geçmişse
    if (startDay.isSame(nowDay, "day") && startDay.isBefore(nowDay)) {
      message.warning("Başlangıç saati geçmiş olamaz.");
      return;
    }

    if (hasRole(["COMPANY_ADMIN", "BRANCH_ADMIN"])) {
      setSelectedRange(slotInfo);
      setIsModalVisible(true);
    }
  };

  const addSession = (values: any) => {
    setLoading(true);

    const [startTime, endTime] = values.timeRange || [null, null];

    const payload = {
      name: values.className,
      description: values.description || null,
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
      totalCapacity: values.totalCapacity || 0,
    };

    sessionService
      .add(payload)
      .then(() => {
        message.success("Event added successfully!");
        if (visibleRange) {
          fetchSessions(visibleRange.start, visibleRange.end, true, true);
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

    // 🔁 00:00 ise 1 gün geri al ve 23:59 yap
    let adjustedEnd = dayjs(end);
    if (
      adjustedEnd.hour() === 0 &&
      adjustedEnd.minute() === 0 &&
      adjustedEnd.second() === 0
    ) {
      adjustedEnd = adjustedEnd
        .subtract(1, "day")
        .hour(23)
        .minute(59)
        .second(0);
    }

    // 🔐 Gün kontrolü
    if (!dayjs(start).isSame(adjustedEnd, "day")) {
      message.warning("Ders süresi bir günü aşamaz.");
      return;
    }

    // ⏳ Geçmişe taşıma kontrolü
    if (originalStart.isBefore(now, "minute")) {
      message.warning("Geçmişteki bir dersi taşıyamazsınız.");
      return;
    }

    if (newStart.isBefore(now, "day")) {
      message.warning("Bir dersi geçmiş bir tarihe taşıyamazsınız.");
      return;
    }

    if (newStart.isSame(now, "day") && newStart.isBefore(now, "minute")) {
      message.warning("Bugün için başlangıç saati geçmiş olamaz.");
      return;
    }

    const updatedSession = {
      ...event,
      startDate: dayjs(start).format("YYYY-MM-DDTHH:mm:ss"),
      endDate: adjustedEnd.format("YYYY-MM-DDTHH:mm:ss"),
      start: new Date(start),
      end: adjustedEnd.toDate(),
    };

    setSessions((prev) =>
      prev.map((e) => (e.id === event.id ? updatedSession : e))
    );

    sessionService
      .update({
        ...event,
        startDate: dayjs(start).format("YYYY-MM-DDTHH:mm:ss"),
        endDate: adjustedEnd.format("YYYY-MM-DDTHH:mm:ss"),
      })
      .then(() => {
        if (visibleRange) {
          fetchSessions(visibleRange.start, visibleRange.end, false, true);
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

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) return;

    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const handleViewChange = (view: View) => {
    localStorage.setItem("savedCalendarView", view);

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("v", view);
    setSearchParams(newParams);
    setCurrentView(view);

    // 📅 View'e göre date düzeltmesi yap
    if (view === "agenda") {
      const startOfMonth = dayjs(date).startOf("month").toDate();
      setDate(startOfMonth);
    }

    if (view === "week") {
      const startOfWeek = dayjs(date).startOf("week").toDate(); // Pazartesi baz alıyor
      setDate(startOfWeek);
    }

    if (view === "day") {
      const startOfDay = dayjs(date).startOf("day").toDate();
      setDate(startOfDay);
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

  const [form] = Form.useForm();

  const handleResize = ({
    event,
    start,
    end,
  }: {
    event: any;
    start: Date | string;
    end: Date | string;
  }) => {
    const newStart = new Date(start);
    const newEnd = new Date(end);

    const updatedSession = {
      ...event,
      startDate: dayjs(newStart).format("YYYY-MM-DDTHH:mm:ss"),
      endDate: dayjs(newEnd).format("YYYY-MM-DDTHH:mm:ss"),
      start: newStart,
      end: newEnd,
    };

    setSessions((prev) =>
      prev.map((e) => (e.id === event.id ? updatedSession : e))
    );

    sessionService
      .update({
        ...event,
        startDate: dayjs(newStart).format("YYYY-MM-DDTHH:mm:ss"),
        endDate: dayjs(newEnd).format("YYYY-MM-DDTHH:mm:ss"),
      })
      .then(() => {
        if (visibleRange) {
          fetchSessions(visibleRange.start, visibleRange.end, false, true);
        }
      })
      .catch(() => {
        message.error("Event resize failed.");
      });
  };

  // --------------- ortak fonksiyonlar ---------------
  const openDrawer = (ev: any) => {
    setSelectedSession(ev);
    setDrawerVisible(true);
  };

  const openEditModal = (ev: any) => {
    setSelectedSession(ev);
    setEditModalOpen(true);
  };

  const handleDelete = (ev: any) => {
    if (!ev) return; // güvenlik

    Modal.confirm({
      title: t.confirmDelete || "Emin misiniz?",
      content:
        t.confirmDeleteText || "Bu dersi silmek istediğinize emin misiniz?",
      okText: t.delete || "Sil",
      cancelText: t.cancel || "Vazgeç",
      okType: "danger",
      onOk: async () => {
        try {
          await sessionService.delete(ev.id);
          message.success(t.deleted || "Silindi");
          /* listeyi yenile */
          if (visibleRange)
            fetchSessions(visibleRange.start, visibleRange.end, false, true);

          setDrawerVisible(false);
          setSelectedSession(null);
        } catch {
          message.error(t.deleteFailed || "Silinemedi");
        }
      },
    });
  };

  const fetch = () => {
    if (visibleRange) {
      return fetchSessions(visibleRange.start, visibleRange.end, true, true);
    }
  };

  const goToDate = (newDate: Date) => {
    const current = dateRef.current;

    if (dayjs(newDate).isBefore(dayjs(current))) {
      setSlideDirection("right");
    } else if (dayjs(newDate).isAfter(dayjs(current))) {
      setSlideDirection("left");
    }

    setDate(newDate);

    const formatted =
      currentView === "day"
        ? dayjs(newDate).format("YYYY-MM-DD")
        : dayjs(newDate).format("YYYY-MM");

    const currentFormatted =
      currentView === "day"
        ? dayjs(current).format("YYYY-MM-DD")
        : dayjs(current).format("YYYY-MM");

    // ❗ Aynı tarihse navigate yapma
    if (formatted !== currentFormatted) {
      const newParams = new URLSearchParams(searchParams.toString());
      navigate(
        {
          pathname: `/sessions/${formatted}`,
          search: `?${newParams.toString()}`,
        },
        { replace: true }
      );
    }

    localStorage.setItem("savedCalendarDate", newDate.toISOString());
  };

  const getDayjsUnit = (view: View): "day" | "week" | "month" => {
    if (view === "day") return "day";
    if (view === "week") return "week";
    return "month";
  };

  const dateRef = useRef(date);
  useEffect(() => {
    dateRef.current = date;
  }, [date]);

  const navigateNext = () => {
    const unit = getDayjsUnit(currentView);
    const newDate = dayjs(dateRef.current).add(1, unit).toDate();
    goToDate(newDate);
  };

  const navigateBack = () => {
    const unit = getDayjsUnit(currentView);
    const newDate = dayjs(dateRef.current).subtract(1, unit).toDate();
    goToDate(newDate);
  };

  useSwipe({
    elementSelector: ".rbc-calendar",
    onSwipeLeft: navigateNext,
    onSwipeRight: navigateBack,
  });

  useEffect(() => {
    const el =
      document.querySelector(".rbc-month-view") ||
      document.querySelector(".rbc-time-content");

    if (!el) return;

    // Önce önceki class'ları temizle
    el.classList.remove("calendar-slide-left", "calendar-slide-right");

    // Yeniden tetiklenmesini garanti etmek için force reflow
    void (el as HTMLElement).offsetWidth; // <- Bu DOM hack'idir: reflow'u tetikler

    // Yöne göre class ekle
    const className =
      slideDirection === "left"
        ? "calendar-slide-left"
        : "calendar-slide-right";
    el.classList.add(className);
  }, [date, slideDirection]);

  const addClassFormRef = useRef<any>(null);

  return (
    <CalendarWrapper>
      <DragAndDropCalendar
        popup
        date={date}
        onNavigate={goToDate}
        view={currentView}
        onView={(view) => setCurrentView(view)}
        draggableAccessor={() =>
          !isMobile && hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"])
        }
        events={sessions}
        localizer={localizer}
        selectable={!isMobile && hasRole(["BRANCH_ADMIN", "COMPANY_ADMIN"])} // Mobilde selectable devre dışı
        onSelectSlot={selectSlot}
        onEventDrop={moveSession}
        resizable={!isMobile && (currentView == "day" || currentView == "week")}
        onEventResize={handleResize}
        messages={messages}
        style={{ height: 700 }}
        length={dayjs(date).daysInMonth()}
        onRangeChange={updateVisibleDate}
        scrollToTime={
          ["day", "week"].includes(currentView)
            ? (() => {
                const now = new Date();
                const scrollHour = Math.max(now.getHours() - 4, 0);
                return new Date(1970, 1, 1, scrollHour, 0, 0);
              })()
            : undefined
        }
        components={{
          toolbar: (props) => (
            <CustomToolbar
              {...props}
              setCompany={setSelectedCompany}
              company={selectedCompany}
              setIsModalVisible={setIsModalVisible}
              onView={handleViewChange}
            />
          ),
          event: ({ event }: { event: any }) => {
            const dayEvents = getDaySessions(event.startDate);
            const showTime = dayEvents.length <= 1;

            return (
              <EventPopover
                event={event}
                handleEditClick={openEditModal}
                handleDelete={handleDelete}
              >
                <CustomEvent
                  event={event}
                  dayEvents={dayEvents}
                  showTime={showTime}
                  onOpenDrawer={openDrawer}
                  refresh={fetch}
                />
              </EventPopover>
            );
          },
        }}
        eventPropGetter={eventPropGetter}
      />

      <StyledModal
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          if (addClassFormRef.current) {
            addClassFormRef.current.resetForm();
          }
        }}
        footer={null}
        closable={false}
        afterOpenChange={(open) => {
          if (open) {
            nameInputRef.current?.focus();
          }
        }}
        styles={{
          mask: { background: "transparent" },
        }}
        modalRender={
          isMobile
            ? undefined
            : (modal) => (
                <Draggable
                  handle=".ant-modal-content"
                  cancel=".ant-modal-body"
                  bounds={bounds}
                  nodeRef={draggleRef}
                  onStart={onStart}
                >
                  <div ref={draggleRef}>{modal}</div>
                </Draggable>
              )
        }
      >
        <AddClassForm
          form={form}
          visible={isModalVisible}
          onSubmit={addSession}
          selectedRange={selectedRange}
          nameRef={nameInputRef}
          currentView={currentView}
          ref={addClassFormRef}
        />
      </StyledModal>

      {/* Takvimin hemen altına ekleyin */}
      <EventDrawer
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedSession(null);
          searchParams.delete("id");
          navigate({ search: searchParams.toString() }, { replace: true });
        }}
        onEdit={() => openEditModal(selectedSession)}
        onDelete={() => handleDelete(selectedSession)}
      />

      {/* Edit Session Modal */}
      <StyledModal
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
      >
        <EditSessionForm
          session={selectedSession}
          onClose={() => setEditModalOpen(false)}
          onUpdated={fetch}
        />
      </StyledModal>
    </CalendarWrapper>
  );
};

export default Scheduler;
