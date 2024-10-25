import React, { useState } from "react";
import MyCalendar from "../../components/scheduler/Scheduler";
import Sider from "antd/es/layout/Sider";

const CompaniesPage: React.FC = () => {
  return (
    <div>
      <MyCalendar />
    </div>
  );
};
export default CompaniesPage;
