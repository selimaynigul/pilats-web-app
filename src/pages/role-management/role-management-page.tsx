import React, { useEffect, useState } from "react";
import { Card } from "components";
import RoleManagementToolbar from "./role-management-toolbar";
import AdminList from "./admin-list/admin-list";
import { hasRole } from "utils/permissionUtils";
import { useFilter, useLanguage } from "hooks";
import { Helmet } from "react-helmet";

const RoleManagementPage: React.FC = () => {
  const { t } = useLanguage();
  const [adminCount, setAdminCount] = useState(0);
  const [isBranchMode, setIsBranchMode] = useState<boolean>(() => {
    if (hasRole(["COMPANY_ADMIN"])) return true;
    const storedValue = localStorage.getItem("isBranchMode");
    return storedValue ? JSON.parse(storedValue) : false;
  });

  useEffect(() => {
    localStorage.setItem("isBranchMode", JSON.stringify(isBranchMode));
  }, [isBranchMode]);

  const { company, setCompany } = useFilter();

  const updateAdminCount = (count: number) => {
    setAdminCount(count);
  };

  return (
    <>
      <Helmet>
        <title>Pilats - {t.roleManagement}</title>
      </Helmet>
      <Card
        toolbar={
          <RoleManagementToolbar
            adminCount={adminCount}
            selectedCompany={company}
            setSelectedCompany={setCompany}
            isBranchMode={isBranchMode}
            setIsBranchMode={setIsBranchMode}
          />
        }
      >
        <AdminList
          isBranchMode={isBranchMode}
          onAdminCountChange={updateAdminCount}
          company={company}
        />
        <div></div>
      </Card>
    </>
  );
};

export default RoleManagementPage;
