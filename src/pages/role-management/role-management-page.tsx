import React, { useState } from "react";
/* import TrainerList from "./trainer-list/trainer-list";
 */
import { Card } from "components";
import RoleManagementToolbar from "./role-management-toolbar";
import AdminList from "./admin-list/admin-list";

const RoleManagementPage: React.FC = () => {
  const [trainerCount, setTrainerCount] = useState(0);
  const [isBranchMode, setIsBranchMode] = useState(true);
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
        onTrainerCountChange={updateTrainerCount}
        company={company}
      />
      <div></div>
    </Card>
  );
};

export default RoleManagementPage;
