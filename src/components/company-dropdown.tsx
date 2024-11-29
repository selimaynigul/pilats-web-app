import React, { useState } from "react";
import { Dropdown, Input, Menu } from "antd";
import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";

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

const companies = [
  "Tech Corp - New York",
  "Eco Energy - San Francisco",
  "Health Solutions - Los Angeles",
  "MacFit - Gebze",
];

interface CompanyDropdownProps {
  selectedCompany: string;
  onCompanySelect: (company: string) => void;
}

const CompanyDropdown: React.FC<CompanyDropdownProps> = ({
  selectedCompany,
  onCompanySelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = companies.filter((company) =>
    company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const companyMenu = (
    <Menu>
      <Menu.Item key="search">
        <Input
          placeholder="Search Company"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Menu.Item>
      {filteredCompanies.map((company, index) => (
        <Menu.Item
          key={index}
          onClick={() => {
            onCompanySelect(company);
          }}
        >
          {company}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={companyMenu} trigger={["click"]}>
      <CompanyDropdownButton>
        {selectedCompany}
        <IconWrapper>
          <IoIosArrowDown />
        </IconWrapper>
      </CompanyDropdownButton>
    </Dropdown>
  );
};

export default CompanyDropdown;
