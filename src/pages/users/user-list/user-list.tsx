import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button } from "antd";
import UserCard from "./user-list-card";
import { usePagination } from "hooks";
import { userService } from "services";
import { ListItem } from "components";
import { mapToItemData } from "utils/utils";

const LoadMoreContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

interface TrainerListProps {
  onUserCountChange: (count: number) => void;
  company: any;
}

const UserList: React.FC<TrainerListProps> = ({
  onUserCountChange,
  company,
}) => {
  const params = useMemo(
    () => ({
      pageSize: 8,
      sort: "DESC",
      companyId: company?.id,
    }),
    [company?.id]
  );

  const {
    items: users,
    loading,
    hasMore,
    loadMore,
  } = usePagination({
    fetchService: userService.search,
    params,
  });

  useEffect(() => {
    onUserCountChange(users.length);
  }, [users, onUserCountChange]);

  return (
    <>
      <Row gutter={[16, 16]}>
        {users.map((user: any, index: number) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <ListItem
              data={mapToItemData({
                ...user,
                detailUrl: "/users",
                passive: true, // TODO: Change this to real data
              })}
              type="user"
            />
          </Col>
        ))}
      </Row>

      {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}

      {!loading && hasMore && (
        <LoadMoreContainer>
          <Button onClick={loadMore}>Load More</Button>
        </LoadMoreContainer>
      )}
    </>
  );
};

export default UserList;
