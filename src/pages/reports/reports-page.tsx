import React, { useState, useEffect, useMemo } from "react";
import { Space, Button } from "antd";
import { Card } from "components";
import { ReloadOutlined } from "@ant-design/icons";
import { Report, PaginatedResponse } from "types/types";
import { ReportListView } from "./reports-table-view";
import reportService from "services/report-service";

const ReportsPage: React.FC = () => {
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const params = useMemo(
    () => ({
      searchByPageDto: {
        pageSize: 10000,
        sort: "DESC",
        pageNo: 0,
      },
    }),
    []
  );

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportService.getReports(params);
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const toolbar = (
    <Space>
      <Button
        icon={<ReloadOutlined />}
        onClick={fetchReports}
        loading={loading}
      >
        Refresh
      </Button>
    </Space>
  );

  return (
    <Card toolbar={toolbar}>
      <ReportListView data={data} loading={loading} />
    </Card>
  );
};

export default ReportsPage;
