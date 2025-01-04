import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { Row, Col, Spin, Button } from "antd";
import { usePagination } from "hooks";
import { trainerService } from "services";
import { Link } from "react-router-dom";
import PackageCard from "./packages-list-card";

const LoadMoreContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

interface PackageListProps {
  onTrainerCountChange: (count: number) => void;
  company: any;
}

const PackageList: React.FC<PackageListProps> = ({
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
    items: packages,
    loading,
    hasMore,
    loadMore,
  } = usePagination({
    fetchService: trainerService.search,
    params,
  });

  useEffect(() => {
    onTrainerCountChange(packages.length);
  }, [packages, onTrainerCountChange]);

  return (
    <>
      <Row gutter={[16, 16]}>
        {packages.map((item: any, index: number) => (
          <Col xs={24} sm={12} md={12} lg={6} key={index}>
            <PackageCard
              title="Yoga Dersi"
              price="7200"
              description="Lorem ipsum dolor si amet text falan filan inter milan lorem impsum dolor si amet"
              features={[
                { value: "16", label: "katılım hakkı" },
                { value: "2", label: "iptal hakkı" },
                { value: "2", label: "bonus hakkı" },
              ]}
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
    </>
  );
};

export default PackageList;
