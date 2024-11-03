import React, { useState } from "react";
import { Avatar, Button, List, Skeleton } from "antd";
import styled from "styled-components";

interface CompanyDataType {
  name: string;
  industry: string;
  location: string;
  logo: string;
  loading: boolean;
}

const mockCompanyData: CompanyDataType[] = [
  {
    name: "Tech Corp",
    industry: "Technology",
    location: "New York, NY",
    logo: "https://via.placeholder.com/150",
    loading: false,
  },
  {
    name: "Health Solutions",
    industry: "Healthcare",
    location: "Los Angeles, CA",
    logo: "https://via.placeholder.com/150",
    loading: false,
  },
  {
    name: "Eco Energy",
    industry: "Renewable Energy",
    location: "San Francisco, CA",
    logo: "https://via.placeholder.com/150",
    loading: false,
  },
  {
    name: "Health Solutions",
    industry: "Healthcare",
    location: "Los Angeles, CA",
    logo: "https://via.placeholder.com/150",
    loading: false,
  },
  {
    name: "Eco Energy",
    industry: "Renewable Energy",
    location: "San Francisco, CA",
    logo: "https://via.placeholder.com/150",
    loading: false,
  },
];

const StyledListItem = styled(List.Item)<{ isLastItem?: boolean }>`
  background-color: white;
  border-radius: 20px;
  padding: 12px !important;
  margin-bottom: ${({ isLastItem }) => (isLastItem ? "0" : "12px")};
  transition: border 0.3s ease;
  border: 1px solid transparent;
  transition: 0.1s;

  &:hover {
    cursor: pointer;
    scale: 1.01;
    box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.12);
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  object-fit: cover;
`;

const CompanyList: React.FC = () => {
  const [initLoading, setInitLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CompanyDataType[]>(mockCompanyData);
  const [list, setList] = useState<CompanyDataType[]>(mockCompanyData);

  const onLoadMore = () => {
    setLoading(true);
    setList(
      data.concat(
        [...new Array(3)].map(() => ({
          loading: true,
          name: "",
          industry: "",
          location: "",
          logo: "",
        }))
      )
    );
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>Load more</Button>
      </div>
    ) : null;

  return (
    <List
      className="company-list"
      loading={initLoading}
      itemLayout="horizontal"
      /*  loadMore={loadMore} */
      dataSource={list}
      renderItem={(item, index) => (
        <StyledListItem
          isLastItem={index === list.length - 1}
          /*  actions={[<a key="edit">edit</a>, <a key="more">more</a>]} */
        >
          <Skeleton avatar title={false} loading={item.loading} active>
            <List.Item.Meta
              avatar={<StyledAvatar src={item.logo} />}
              title={<a href="https://ant.design">{item.name}</a>}
              description={`${item.industry} • ${item.location}`}
            />
            {/*   <div>Additional content</div> */}
          </Skeleton>
        </StyledListItem>
      )}
    />
  );
};

export default CompanyList;
