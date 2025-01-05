import React from 'react';
import { Table } from 'antd';
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
  return (
    <Container>
      <Table 
        columns={getReportColumns()}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scroll={{ x: true }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} records`
        }}
      />
    </Container>
  );
};