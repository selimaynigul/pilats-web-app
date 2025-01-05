import React, { useState, useEffect } from "react";
import { Space, Button } from "antd";
import { Card } from "components";
import { ReloadOutlined } from "@ant-design/icons";
import { Report } from "types/report.types";
import { ReportListView } from "./reports-table-view";

const ReportsPage: React.FC = () => {
  const [data, setData] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const tempData: Report[] = [{
        id: 1,
        change_owner: "admin@test.com",
        change_date: "2024-03-15T10:30:00",
        entity_name: "User",
        branchId: "BR001",
        companyId: "CP001",
        prev_json: { name: "John", status: "active" },
        updated_json: { name: "John", status: "inactive" },
        isSuccessful: true
      },
      {
        id: 1,
        change_owner: "admin@test.com",
        change_date: "2024-03-15T10:30:00",
        entity_name: "User",
        branchId: "BR001",
        companyId: "CP001",
        prev_json: { name: "John", status: "active" },
        updated_json: { name: "John", status: "inactive" },
        isSuccessful: false
      }
    ];
      setData(tempData);
      
      // Uncomment for real API call:
      // const response = await reportService.getReports();
      // setData(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
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