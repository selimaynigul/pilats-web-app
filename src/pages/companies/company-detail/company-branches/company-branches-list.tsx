import React, { useState } from "react";
import styled from "styled-components";
import { Row, Col, Dropdown, Menu, message, Modal, Form, Input } from "antd";
import AddButton from "components/AddButton";
import { BsThreeDotsVertical, BsTrash, BsPencil } from "react-icons/bs";
import { branchService } from "services";
import { useNavigate, useParams } from "react-router-dom";
import { hasRole } from "utils/permissionUtils";

const Container = styled.div`
  height: 100%;
  border-radius: 20px;
  padding: 12px;

  h2 {
    color: ${({ theme }) => theme.primary};
  }
`;

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

const MenuItem = styled(Menu.Item)`
  display: flex;
  align-items: center;
  gap: 10px;

  &.delete {
    color: red;
  }
`;

const CompanyBranchList: React.FC<{
  branches: any[];
  onBranchUpdate: () => void;
}> = ({ branches, onBranchUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<any>(null);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleAddBranch = (values: any) => {
    branchService
      .add({ companyId: id, ...values })
      .then(() => {
        message.success("Branch added successfully");
        setIsModalVisible(false);
        form.resetFields();
        onBranchUpdate();
      })
      .catch((error: any) => {
        console.error("Error adding branch:", error);
        message.error("Failed to add branch");
      });
  };

  const handleUpdateBranch = (values: any) => {
    branchService
      .update({
        companyId: id,
        branchName: values.branchName,
        id: currentBranch.id,
      })
      .then(() => {
        message.success("Branch updated successfully");
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
        onBranchUpdate();
      })
      .catch((error: any) => {
        console.error("Error updating branch:", error);
        message.error("Failed to update branch");
      });
  };

  const handleDelete = (branchId: any) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action will delete the branch permanently.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        branchService
          .delete(branchId)
          .then(() => {
            message.success("Branch deleted successfully");
            onBranchUpdate();
          })
          .catch((error: any) => {
            console.error("Error deleting branch:", error);
            message.error("Failed to delete branch");
          });
      },
    });
  };

  const handleEdit = (branch: any) => {
    setCurrentBranch(branch);
    setIsUpdateModalVisible(true);
    updateForm.setFieldsValue({ branchName: branch.branchName });
  };

  const handleSeeTrainers = (branch: any) => {
    navigate(`/trainers?company=${id}&branch=${branch.id}`);
  };

  const handleSeeSessions = (branch: any) => {
    navigate(`/sessions?company=${id}&branch=${branch.id}`);
  };

  const renderMenu = (branch: any) => (
    <Menu>
      <MenuItem key="trainers" onClick={() => handleSeeTrainers(branch)}>
        Trainers
      </MenuItem>
      {/*   <MenuItem key="sessions" onClick={() => handleSeeSessions(branch)}>
        Sessions
      </MenuItem> */}
      <Menu.Divider />
      <MenuItem key="edit" onClick={() => handleEdit(branch)}>
        <BsPencil style={{ marginRight: 8 }} /> Update
      </MenuItem>
      <MenuItem
        key="delete"
        className="delete"
        onClick={() => handleDelete(branch.id)}
        style={{ color: "red" }}
      >
        <BsTrash style={{ marginRight: 8 }} /> Delete
      </MenuItem>
    </Menu>
  );
  return (
    <Container>
      <Header>
        <h2>Branches</h2>
        {hasRole(["COMPANY_ADMIN", "ADMIN"]) && (
          <AddButton onClick={() => setIsModalVisible(true)} />
        )}
      </Header>
      <Row gutter={[16, 16]}>
        {branches.map((branch, index) => (
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
        ))}
      </Row>

      {/* Add Branch Modal */}
      <Modal
        title="Add Branch"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          form.validateFields().then(handleAddBranch).catch(console.error);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="branchName"
            label="Branch Name"
            rules={[
              { required: true, message: "Please enter the branch name" },
            ]}
          >
            <Input placeholder="Enter branch name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Branch Modal */}
      <Modal
        title="Add Branch"
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => {
          updateForm
            .validateFields()
            .then(handleUpdateBranch)
            .catch(console.error);
        }}
      >
        <Form form={updateForm} layout="vertical">
          <Form.Item
            name="branchName"
            label="Branch Name"
            rules={[
              { required: true, message: "Please enter the branch name" },
            ]}
          >
            <Input placeholder="Enter branch name" />
          </Form.Item>
        </Form>
      </Modal>
    </Container>
  );
};

export default CompanyBranchList;
