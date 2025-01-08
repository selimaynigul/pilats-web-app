import React, { useEffect, useState } from 'react';
import { Table, TableProps } from 'antd';
import styled from 'styled-components';
import { Report } from 'types/report.types';
import { getReportColumns } from './report-column/report-columns';

const Container = styled.div`
  .ant-table {
    background: white;
    border-radius: 20px;
  }

  .json-viewer {
    max-height: 200px;
    overflow-y: auto;
  }
`;

interface ReportListViewProps {
  data: Report[];
  loading: boolean;
}

export const ReportListView: React.FC<ReportListViewProps> = ({ data, loading }) => {
  const [sortedInfo, setSortedInfo] = useState<{ columnKey?: string; order?: 'ascend' | 'descend' }>({});

  const [sortedData, setSortedData] = useState<Report[]>(data);
  useEffect(() => {
    setSortedData(data);
  }, [data]);
  const handleChange: TableProps<Report>['onChange'] = (pagination, filters, sorter: any) => {
    setSortedInfo({
      columnKey: sorter.columnKey,
      order: sorter.order,
    });
  
    if (sorter.order) {
      const sorted = [...data].sort((a, b) => {
        const aValue = a[sorter.field as keyof Report];
        const bValue = b[sorter.field as keyof Report];
  
        if (aValue == null && bValue == null) return 0; // Her ikisi de null ise eşit.
        if (aValue == null) return sorter.order === 'ascend' ? -1 : 1; // `aValue` null ise sıralamayı değiştir.
        if (bValue == null) return sorter.order === 'ascend' ? 1 : -1; // `bValue` null ise sıralamayı değiştir.
  
        if (aValue < bValue) return sorter.order === 'ascend' ? -1 : 1;
        if (aValue > bValue) return sorter.order === 'ascend' ? 1 : -1;
        return 0;
      });
      setSortedData(sorted);
    } else {
      setSortedData(data); // Sıralama yapılmadığında orijinal veri geri yüklenir.
    }
  };
  

  const columns = getReportColumns().map(col => ({
    ...col,
    sorter: true,
    sortOrder: sortedInfo.columnKey === col.key ? sortedInfo.order : null,
  }));

  return (
    <Container>
      <Table
        columns={columns}
        dataSource={sortedData}
        rowKey="id"
        loading={loading}
        scroll={{ x: true }}
        onChange={handleChange}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} records`,
        }}
      />
    </Container>
  );
};
