import { ColumnsType } from 'antd/es/table';
import { Typography, Tag } from 'antd';
import { Report } from 'types/report.types';
import { JsonViewer } from "@textea/json-viewer";

const { Text } = Typography;

export const getReportColumns = (): ColumnsType<Report> => [
  {
    title: "Change Owner",
    dataIndex: "change_owner",
    key: "change_owner",
    render: (text: string) => <Text copyable>{text}</Text>
  },
  {
    title: "Change Date",
    dataIndex: "change_date",
    key: "change_date",
    render: (date: string) => new Date(date).toLocaleString()
  },
  {
    title: "Entity",
    dataIndex: "entity_name",
    key: "entity_name"
  },
  {
    title: "Previous Value",
    dataIndex: "prev_json",
    key: "prev_json",
    render: (json: object) => (
      <div className="json-viewer">
        <JsonViewer value={json} />
      </div>
    )
  },
  {
    title: "Updated Value",
    dataIndex: "updated_json",
    key: "updated_json",
    render: (json: object) => (
      <div className="json-viewer">
        <JsonViewer value={json} />
      </div>
    )
  },
  {
    title: "Status",
    dataIndex: "isSuccessful",
    key: "isSuccessful",
    render: (successful: boolean) => (
      <Tag color={successful ? "success" : "error"}>
        {successful ? "Success" : "Failed"}
      </Tag>
    )
  }
];