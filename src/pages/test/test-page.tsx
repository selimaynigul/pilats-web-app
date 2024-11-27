import React, { useState } from "react";
import styled from "styled-components";
import { Button, Input, Form, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  branchService,
  branchAdminService,
  companyAdminService,
  companyService,
} from "services";

const TestPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [responseText, setResponseText] = useState<string>("");

  const handleRequest = async () => {
    if (!selectedRequest) return;

    const requestMapping: Record<string, () => Promise<any>> = {
      addBranch: () => branchService.add(formValues),
      updateBranch: () => branchService.update(formValues),
      deleteBranch: () => branchService.delete(formValues.id),
      getBranchesByPagination: () => branchService.getByPagination(formValues),

      addCompany: () => companyService.add(formValues),
      updateCompany: () => companyService.update(formValues),
      deleteCompany: () => companyService.delete(formValues.id),
      getCompaniesByPagination: () =>
        companyService.getByPagination(formValues),

      registerBranchAdmin: () => branchAdminService.register(formValues),
      updateBranchAdmin: () => branchAdminService.update(formValues),
      deleteBranchAdmin: () => branchAdminService.delete(formValues.id),
      searchBranchAdmins: () => branchAdminService.search(formValues),
      getBranchAdminById: () => branchAdminService.getById(formValues.id),

      registerCompanyAdmin: () => companyAdminService.register(formValues),
      updateCompanyAdmin: () => companyAdminService.update(formValues),
      deleteCompanyAdmin: () => companyAdminService.delete(formValues.id),
      searchCompanyAdmins: () => companyAdminService.search(formValues),
      getCompanyAdminById: () => companyAdminService.getById(formValues.id),
    };

    try {
      const response = await requestMapping[selectedRequest]();
      setResponseText(JSON.stringify(response.data, null, 2));
      message.success("Request successful!");
    } catch (error) {
      setResponseText("Error: " + (error as Error).message);
      message.error("Something went wrong.");
    }
  };

  const renderInputs = () => {
    const inputMapping: Record<string, JSX.Element> = {
      addBranch: (
        <>
          <Form.Item label="Company ID" name="companyId">
            <Input
              placeholder="Enter Company ID"
              onChange={(e) =>
                setFormValues({ ...formValues, companyId: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Branch Name" name="branchName">
            <Input
              placeholder="Enter Branch Name"
              onChange={(e) =>
                setFormValues({ ...formValues, branchName: e.target.value })
              }
            />
          </Form.Item>
        </>
      ),
      updateBranch: (
        <>
          <Form.Item label="Branch ID" name="id">
            <Input
              placeholder="Enter Branch ID"
              onChange={(e) =>
                setFormValues({ ...formValues, id: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Branch Name" name="branchName">
            <Input
              placeholder="Enter Branch Name"
              onChange={(e) =>
                setFormValues({ ...formValues, branchName: e.target.value })
              }
            />
          </Form.Item>
        </>
      ),
      deleteBranch: (
        <Form.Item label="Branch ID" name="id">
          <Input
            placeholder="Enter Branch ID"
            onChange={(e) =>
              setFormValues({ ...formValues, id: e.target.value })
            }
          />
        </Form.Item>
      ),
      getBranchesByPagination: (
        <>
          <Form.Item label="Page" name="page">
            <Input
              placeholder="Enter Page Number"
              onChange={(e) =>
                setFormValues({ ...formValues, pageNo: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Size" name="size">
            <Input
              placeholder="Enter Page Size"
              onChange={(e) =>
                setFormValues({ ...formValues, pageSize: e.target.value })
              }
            />
          </Form.Item>
        </>
      ),
      addCompany: (
        <>
          <Form.Item label="Company Name" name="companyName">
            <Input
              placeholder="Enter Company Name"
              onChange={(e) =>
                setFormValues({ ...formValues, companyName: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Telephone" name="telNo">
            <Input
              placeholder="Enter Telephone Number"
              onChange={(e) =>
                setFormValues({ ...formValues, telNo: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Email" name="mail">
            <Input
              placeholder="Enter Email Address"
              onChange={(e) =>
                setFormValues({ ...formValues, mail: e.target.value })
              }
            />
          </Form.Item>
        </>
      ),
      deleteCompany: (
        <Form.Item label="Company ID" name="id">
          <Input
            placeholder="Enter Company ID"
            onChange={(e) =>
              setFormValues({ ...formValues, id: e.target.value })
            }
          />
        </Form.Item>
      ),
      searchBranchAdmins: (
        <Form.Item label="Filter" name="filter">
          <Input
            placeholder="Enter Search Filter"
            onChange={(e) =>
              setFormValues({ ...formValues, filter: e.target.value })
            }
          />
        </Form.Item>
      ),
      getBranchAdminById: (
        <Form.Item label="Branch Admin ID" name="id">
          <Input
            placeholder="Enter Branch Admin ID"
            onChange={(e) =>
              setFormValues({ ...formValues, id: e.target.value })
            }
          />
        </Form.Item>
      ),
      // Add additional inputs for other services as needed
    };

    return (
      inputMapping[selectedRequest!] || (
        <p style={{ marginBottom: 20 }}>Select a request</p>
      )
    );
  };
  return (
    <Container>
      <Column>
        <h1 style={{ marginBottom: 40 }}>Test Services</h1>

        <Section>
          <h2>Branch Service</h2>
          <StyledButton
            type="primary"
            onClick={() => setSelectedRequest("addBranch")}
          >
            Add Branch
          </StyledButton>
          <StyledButton
            type="default"
            onClick={() => setSelectedRequest("updateBranch")}
          >
            Update Branch
          </StyledButton>
          <StyledButton
            danger
            onClick={() => setSelectedRequest("deleteBranch")}
          >
            Delete Branch
          </StyledButton>
          <StyledButton
            type="default"
            onClick={() => setSelectedRequest("getBranchesByPagination")}
          >
            Get Branches by Pagination
          </StyledButton>
        </Section>

        <Section>
          <h2>Company Service</h2>
          <StyledButton
            type="primary"
            onClick={() => setSelectedRequest("addCompany")}
          >
            Add Company
          </StyledButton>
          <StyledButton
            type="default"
            onClick={() => setSelectedRequest("updateCompany")}
          >
            Update Company
          </StyledButton>
          <StyledButton
            danger
            onClick={() => setSelectedRequest("deleteCompany")}
          >
            Delete Company
          </StyledButton>
          <StyledButton
            type="default"
            onClick={() => setSelectedRequest("getCompaniesByPagination")}
          >
            Get Companies by Pagination
          </StyledButton>
        </Section>

        <Section>
          <h2>Branch Admin Service</h2>
          <StyledButton
            type="primary"
            onClick={() => setSelectedRequest("registerBranchAdmin")}
          >
            Register Branch Admin
          </StyledButton>
          <StyledButton
            type="default"
            onClick={() => setSelectedRequest("updateBranchAdmin")}
          >
            Update Branch Admin
          </StyledButton>
          <StyledButton
            danger
            onClick={() => setSelectedRequest("deleteBranchAdmin")}
          >
            Delete Branch Admin
          </StyledButton>
          <StyledButton
            type="default"
            onClick={() => setSelectedRequest("searchBranchAdmins")}
          >
            Search Branch Admins
          </StyledButton>
          <StyledButton
            type="default"
            onClick={() => setSelectedRequest("getBranchAdminById")}
          >
            Get Branch Admin by ID
          </StyledButton>
        </Section>

        <Section>
          <h2>Company Admin Service</h2>
          <StyledButton
            type="primary"
            onClick={() => setSelectedRequest("registerCompanyAdmin")}
          >
            Register Company Admin
          </StyledButton>
          <StyledButton
            type="default"
            onClick={() => setSelectedRequest("updateCompanyAdmin")}
          >
            Update Company Admin
          </StyledButton>
          <StyledButton
            danger
            onClick={() => setSelectedRequest("deleteCompanyAdmin")}
          >
            Delete Company Admin
          </StyledButton>
          <StyledButton
            type="default"
            onClick={() => setSelectedRequest("searchCompanyAdmins")}
          >
            Search Company Admins
          </StyledButton>
          <StyledButton
            type="default"
            onClick={() => setSelectedRequest("getCompanyAdminById")}
          >
            Get Company Admin by ID
          </StyledButton>
        </Section>
      </Column>

      <ResponseColumn>
        <h3>Inputs:</h3>
        <Form layout="vertical" onFinish={handleRequest}>
          {renderInputs()}
          {selectedRequest && (
            <Form.Item>
              <StyledButton type="primary" htmlType="submit">
                Submit Request
              </StyledButton>
            </Form.Item>
          )}
        </Form>

        <h3>Response:</h3>
        <pre>{responseText}</pre>
      </ResponseColumn>
    </Container>
  );
};

export default TestPage;

// Styled Components
const Container = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
`;

const Column = styled.div`
  flex: 1;
  max-width: 50%;
  overflow-y: auto;

  h1 {
    margin-bottom: 20px;
  }
`;

const ResponseColumn = styled.div`
  flex: 1;
  max-width: 50%;
  overflow-y: auto;

  h3 {
    margin-bottom: 10px;
  }

  pre {
    background-color: #f5f5f5;
    padding: 10px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow-x: auto;
  }
`;

const Section = styled.div`
  margin-bottom: 40px;

  h2 {
    margin-bottom: 20px;
  }
`;

const StyledButton = styled(Button)`
  margin-right: 10px;
  margin-bottom: 10px;
`;
