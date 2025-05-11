import React, { useState } from "react";
import UserList from "./user-list/user-list";
import { Card } from "components";
import UsersToolbar from "./users-toolbar";
import { useLanguage } from "hooks";
import { Helmet } from "react-helmet";

const UsersPage: React.FC = () => {
  const { t } = useLanguage();
  const [userCount, setUserCount] = useState(0);
  const [company, setCompany] = useState({
    companyName: t.all,
    id: null,
  });

  const updateUserCount = (count: number) => {
    setUserCount(count);
  };

  return (
    <>
      <Helmet>
        <title>Pilats - {t.users}</title>
      </Helmet>
      <Card
        toolbar={
          <UsersToolbar
            userCount={userCount}
            selectedCompany={company}
            setSelectedCompany={setCompany}
          />
        }
      >
        <UserList onUserCountChange={updateUserCount} company={company} />
      </Card>
    </>
  );
};

export default UsersPage;
