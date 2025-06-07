import { Avatar, Tooltip } from "antd";
import { useLanguage } from "hooks";
import { useEffect, useState } from "react";
import { sessionService } from "services";

export const AttendeesSection: React.FC<{ sessionId: number }> = ({
  sessionId,
}) => {
  const { t } = useLanguage();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    sessionService
      .getSessionCustomers({ sessionId, sessionCustomerEventsList: ["JOINED"] })
      .then((res) => setList(res.data))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <small>{t.loading}</small>;
  if (!list.length) return <small>{t.noAttendeesYet}</small>;

  return (
    <>
      <strong>{t.attendees}</strong>
      <Avatar.Group max={{ count: 3 }}>
        {list.map((u) => (
          <Tooltip key={u.id} title={`${u.name} ${u.surname}`}>
            <Avatar>{u.name?.[0]}</Avatar>
          </Tooltip>
        ))}
      </Avatar.Group>
    </>
  );
};
