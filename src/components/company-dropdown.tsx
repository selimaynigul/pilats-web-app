import React, { useState, useEffect, useCallback } from "react";
import { Dropdown, Input, Menu, Spin } from "antd";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";
import { branchService, companyService } from "services";
import { getCompanyId, hasRole } from "utils/permissionUtils";

const CompanyDropdownButton = styled.button`
  position: relative;
  margin: 0;
  border: none;
  height: 35px;
  padding: 5px 15px;
  color: #4d3abd;
  cursor: pointer;
  background: transparent;
  display: flex;
  align-items: center;
  font-weight: bold;
  border: 1px solid #4d3abd;
  border-radius: 50px;
  transition: padding-right 0.3s ease;

  &:hover {
    padding-right: 35px;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 15px;
  display: flex;
  align-items: center;
  opacity: 0;
  transform: translateX(10px);
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;

  ${CompanyDropdownButton}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

interface CompanyDropdownProps {
  selectedItem: any;
  onSelect: (company: string) => void;
}

const CompanyDropdown: React.FC<CompanyDropdownProps> = ({
  selectedItem,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>([]);

  const fetchCompanies = useCallback(async (query: string) => {
    if (!query) {
      setResponse([]);
      return;
    }

    setLoading(true);
    try {
      const response = await companyService.search({ companyName: query });
      setResponse(response.data || []);
      console.log("company response: ", response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBranches = useCallback(async (query: string) => {
    if (!query) {
      setResponse([]);
      return;
    }

    setLoading(true);
    try {
      const response = await branchService.search({
        branchName: query,
        companyId: getCompanyId(),
      });
      setResponse(response.data || []);
      console.log("branch response: ", response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasRole(["COMPANY_ADMIN"])) {
      fetchBranches(searchQuery);
    } else if (hasRole(["ADMIN"])) {
      fetchCompanies(searchQuery);
    }
  }, [searchQuery]);

  const companyMenu = (
    <Menu>
      <Menu.Item key="search">
        <Input
          placeholder="Search Company"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={(e) => e?.stopPropagation()}
        />
      </Menu.Item>
      {loading ? (
        <Menu.Item key="loading" disabled>
          <Spin size="small" /> Loading...
        </Menu.Item>
      ) : response.length > 0 ? (
        response.map((item: any, index: number) => (
          <Menu.Item key={item.id || index} onClick={() => onSelect(item)}>
            {item.companyName}
            {hasRole(["ADMIN", "COMPANY_ADMIN"]) && `- ${item.branchName}`}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item key="no-results" disabled>
          No companies found
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={companyMenu} trigger={["click"]}>
      <CompanyDropdownButton>
        {selectedItem.companyName || "Select Company"}
        <IconWrapper>
          <IoIosArrowDown />
        </IconWrapper>
      </CompanyDropdownButton>
    </Dropdown>
  );
};

export default CompanyDropdown;
