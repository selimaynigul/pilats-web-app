import React, { useEffect, useState } from "react";
import { Card } from "components";
import RoleManagementToolbar from "./role-management-toolbar";
import AdminList from "./admin-list/admin-list";

const RoleManagementPage: React.FC = () => {
  const [trainerCount, setTrainerCount] = useState(0);
  const [isBranchMode, setIsBranchMode] = useState<boolean>(() => {
    const storedValue = localStorage.getItem("isBranchMode");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    localStorage.setItem("isBranchMode", JSON.stringify(isBranchMode));
  }, [isBranchMode]);

  const [company, setCompany] = useState({
    companyName: "All",
    id: null,
  });

  const updateTrainerCount = (count: number) => {
    setTrainerCount(count);
  };

  return (
    <Card
      toolbar={
        <RoleManagementToolbar
          trainerCount={trainerCount}
          selectedCompany={company}
          setSelectedCompany={setCompany}
          isBranchMode={isBranchMode}
          setIsBranchMode={setIsBranchMode}
        />
      }
    >
      <AdminList
        isBranchMode={isBranchMode}
        onAdminCountChange={updateTrainerCount}
        company={company}
      />
      <div></div>
    </Card>
  );
};

export default RoleManagementPage;
