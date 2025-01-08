import { Col, Dropdown, Row, theme } from "antd";
import Alert from "antd/es/alert/Alert";
import AddButton from "components/AddButton";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import styled from "styled-components";

const Container = styled.div`
  height: 100%;
  border-radius: 20px;
  padding: 12px;

  h2 {
    color: ${({ theme }) => theme.primary};
    margin-bottom: 24px;
  }

  .ant-alert-icon {
    color: ${({ theme }) => theme.primary};
  }
`;
const ClassContainer = styled.div``;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const EditButton = styled.div`
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;

  &:hover {
    cursor: pointer;
    background: #f6f6f6;
  }
`;

const BranchCard = styled.div`
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  padding: 16px;
  background-color: #fff;
  transition: 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.1em;
    color: #333;
  }

  p {
    margin: 4px 0 0;
    font-size: 0.9em;
    color: #666;
  }

  &:hover {
    cursor: pointer;
    box-shadow: 0px 8px 42px -5px rgba(93, 70, 229, 0.2);
  }
`;

const TrainerClassesList: React.FC<{ trainer: any }> = ({ trainer }) => {
  return (
    <Container>
      <Header>
        <h2>Classes</h2>
        <AddButton onClick={() => {}} />
      </Header>
      <Row gutter={[16, 16]}>
        {trainer && !trainer?.active ? (
          <Alert
            message="Deactive trainers cannot have classes!"
            type="info"
            showIcon
            closable
            style={{
              width: "100%",
              borderRadius: "15px",
              border: "1px solid #e6e3ff",
              background: "#e6e3ff",
            }}
          />
        ) : (
          <div></div>
        )}
        {/* {branches.map((branch, index) => (
          <Col xs={24} sm={12} key={index}>
            <BranchCard>
              <div>
                <h3>{branch.branchName}</h3>
                <p>{branch.address || "No address available"}</p>
              </div>
              <Dropdown
                overlay={renderMenu(branch)}
                trigger={["click"]}
                placement="bottomRight"
              >
                <EditButton>
                  <BsThreeDotsVertical />
                </EditButton>
              </Dropdown>
            </BranchCard>
          </Col>
        ))} */}
      </Row>
    </Container>
  );
};
export default TrainerClassesList;
