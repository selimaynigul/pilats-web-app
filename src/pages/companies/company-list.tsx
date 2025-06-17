import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button } from "antd";
import { usePagination } from "hooks";
import { companyService } from "services";
import { ListContainer, ListItem } from "components";
import { mapToItemData } from "utils/utils";

const LoadMoreContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

interface TrainerListProps {
  onTrainerCountChange: (count: number) => void;
  company: any;
}

const CompanyList: React.FC<TrainerListProps> = ({
  onTrainerCountChange,
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
    items: trainers,
    loading,
    hasMore,
    loadMore,
  } = usePagination({
    fetchService: companyService.search,
    params,
  });

  useEffect(() => {
    onTrainerCountChange(trainers.length);
  }, [trainers, onTrainerCountChange]);

  return (
    <ListContainer>
      <Row gutter={[16, 16]}>
        {trainers.map((company: any, index: number) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <ListItem
              data={mapToItemData({
                ...company,
                detailUrl: "/companies",
              })}
              type="company"
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

      {!hasMore && !loading && <></>}
    </ListContainer>
  );
};

export default CompanyList;
