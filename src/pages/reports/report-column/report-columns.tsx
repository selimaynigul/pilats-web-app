import { ColumnsType } from "antd/es/table";
import { Typography, Tag } from "antd";
import { Report } from "types/types";
import { JsonViewer } from "@textea/json-viewer";

const { Text } = Typography;

interface ReportRecord {
  id: number;
  userId: number;
  companyId: number | null;
  branchId: number | null;
  userEmail: string;
  userRole: string;
  changeDate: string;
  entityName: string;
  operation: string;
  previousEntityJson: object | null;
  updatedEntityJson: object | null;
  success: boolean;
}

const getEntityId = (record: ReportRecord) => {
  switch (record.entityName) {
    case "COMPANY":
      return record.companyId;
    case "BRANCH":
      return record.branchId;
    case "USER":
      return record.userId;
    default:
      return null;
  }
};

export const getReportColumns = (): ColumnsType<Report> => [
  {
    title: "Change Owner",
    dataIndex: "userEmail",
    key: "userEmail",
    width: 300,
    render: (text: string) => <Text copyable>{text}</Text>,
  },
  {
    title: "Role",
    dataIndex: "userRole",
    key: "userRole",
    width: 150,
  },
  {
    title: "Change Date",
    dataIndex: "changeDate",
    key: "changeDate",
    width: 150,
    render: (date: string) => new Date(date).toLocaleString(),
  },
  {
    title: "Entity",
    dataIndex: "entityName",
    key: "entityName",
    width: 200,
  },
  {
    title: "Operation",
    dataIndex: "operation",
    key: "operation",
    width: 200,
  },
  {
    title: "Previous Value",
    dataIndex: "previousEntityJson",
    key: "previousEntityJson",
    width: 450,
    render: (json) => {
      let parsedJson = {};
      try {
        parsedJson = json ? JSON.parse(json) : {};
      } catch (error) {
        console.error("Invalid JSON for Previous Value:", error);
      }
      return (
        <div className="json-viewer">
          <JsonViewer value={parsedJson} />
        </div>
      );
    },
  },
  {
    title: "Updated Value",
    dataIndex: "updatedEntityJson",
    key: "updatedEntityJson",
    width: 450,
    render: (json) => {
      let parsedJson = {};
      try {
        parsedJson = json ? JSON.parse(json) : {};
      } catch (error) {
        console.error("Invalid JSON for Updated Value:", error);
      }
      return (
        <div className="json-viewer">
          <JsonViewer value={parsedJson} />
        </div>
      );
    },
  },
  {
    title: "Status",
    dataIndex: "isSuccess",
    width: 150,
    key: "isSuccess",
    render: (success: boolean) => (
      <Tag color={success ? "success" : "error"}>
        {success ? "Success" : "Failed"}
      </Tag>
    ),
  },
];
