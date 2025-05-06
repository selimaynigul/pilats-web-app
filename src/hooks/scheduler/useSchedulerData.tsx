// hooks/useSchedulerData.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { sessionService } from "services";
import { getCompanyId, hasRole } from "utils/permissionUtils";
import { message } from "antd";

export const useSchedulerData = (company: any, date: Date | null) => {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [visibleRange, setVisibleRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

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

  const fetchSessions = useCallback(
    async (startDate: Date, endDate: Date, showLoading = true) => {
      if (showLoading) setLoading(true);

      const finalParams = {
        ...params,
        startDate: dayjs(startDate).toISOString(),
        endDate: dayjs(endDate).toISOString(),
      };

      try {
        const response = await sessionService.search(finalParams);
        const formatted = response.data.map((s: any) => ({
          ...s,
          start: new Date(s.startDate),
          end: new Date(s.endDate),
        }));
        setSessions(formatted);
      } catch (error) {
        console.error("Error fetching events:", error);
        message.error("Failed to load events.");
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [params]
  );

  useEffect(() => {
    if (date) {
      const start = dayjs(date).startOf("month").subtract(7, "day").toDate();
      const end = dayjs(date).endOf("month").add(7, "day").toDate();
      setVisibleRange({ start, end });
    }
  }, [date]);

  useEffect(() => {
    if (visibleRange) {
      fetchSessions(visibleRange.start, visibleRange.end, true);
    }
  }, [visibleRange, fetchSessions]);

  const updateSessionLocally = (updatedSession: any) => {
    setSessions((prev) =>
      prev.map((e) => (e.id === updatedSession.id ? updatedSession : e))
    );
  };

  const updateVisibleRange = (newDate: Date) => {
    const start = dayjs(newDate).startOf("month").subtract(7, "day").toDate();
    const end = dayjs(newDate).endOf("month").add(7, "day").toDate();
    setVisibleRange({ start, end });
  };

  return {
    sessions,
    fetchSessions,
    loading,
    setLoading,
    visibleRange,
    updateSessionLocally,
    updateVisibleRange,
  };
};
