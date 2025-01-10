import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dropdown, Input, Menu, Spin } from "antd";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import { flushSync } from "react-dom";

import { branchService, companyService } from "services";
import { getCompanyId, hasRole } from "utils/permissionUtils";
import { AiOutlineReload } from "react-icons/ai";

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
  transition: all 0.3s ease;

  &:hover {
    padding-right: 35px;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 10px;
  font-size: 15px;
  font-weight: bold;
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
const StyledInput = styled(Input)<{ inputWidth: string }>`
  /* Remove default focus ring on the affix wrapper */
  &&.ant-input-affix-wrapper {
    &:hover {
      border-color: #4d3abd;
    }

    /* When the affix wrapper is focused */
    &.ant-input-affix-wrapper-focused {
      border-color: #4d3abd;
      box-shadow: none; /* Remove AntD's default box shadow */
    }
  }
  height: 35px;
  border: 1px solid #4d3abd;
  border-radius: 50px;
  padding: 5px 15px;
  font-weight: bold;
  color: #4d3abd;
  background: transparent;
  transition: width 0.3s ease;
  width: ${({ inputWidth }) => inputWidth};

  &:focus {
    outline: none; /* Removes the default blue outline */
    box-shadow: none; /* Removes any box shadow */
    border-color: #4d3abd !important; /* Keeps your desired border color */
  }
`;

const StyledReload = styled(AiOutlineReload)`
  cursor: pointer;
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
  const [searchMode, setSearchMode] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [inputWidth, setInputWidth] = useState("0px");
  const [ignoreNextClose, setIgnoreNextClose] = useState(false);

  useEffect(() => {
    if (buttonRef.current) {
      const buttonWidth = buttonRef.current.offsetWidth;
      setInputWidth(`${buttonWidth + 35}px`);
    }
  }, [searchMode, buttonRef]);

  const fetchCompanies = useCallback(async (query: string) => {
    if (!query) {
      setResponse([]);
      return;
    }

    setLoading(true);
    try {
      const response = await companyService.search({
        companyName: query || null,
      });
      setResponse(response.data || []);
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
        branchName: query || null,
        companyId: getCompanyId(),
      });
      setResponse(response.data || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      if (hasRole(["COMPANY_ADMIN"])) {
        fetchBranches(searchQuery);
      } else if (hasRole(["ADMIN"])) {
        fetchCompanies(searchQuery);
      }
    } else {
      setResponse([]);
    }
  }, [searchQuery]);

  const handleButtonClick = () => {
    setSearchMode(true);
    setDropdownVisible(true);
    setTimeout(() => {
      setInputWidth("200px");
    }, 10);
  };

  const handleInputBlur = () => {
    setSearchMode(false);
    setDropdownVisible(false);
    setSearchQuery("");
    setInputWidth("0px");
  };

  const handleSelect = (item: any) => {
    onSelect(item);
    setSearchMode(false);
    setDropdownVisible(false);
    setSearchQuery("");
  };

  const menu = (
    <Menu>
      {/* Render fetched items */}
      {response.map((item: any) => (
        <Menu.Item key={item.id} onClick={() => handleSelect(item)}>
          {item.companyName}
          {hasRole(["COMPANY_ADMIN"]) && ` - ${item.branchName}`}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {searchMode ? (
        <Dropdown
          overlay={menu}
          open={dropdownVisible}
          onOpenChange={(visible) => {
            if (!visible && ignoreNextClose) {
              setIgnoreNextClose(false);
              handleInputBlur();
              return;
            }
            setDropdownVisible(visible);
          }}
          trigger={["click"]}
        >
          <StyledInput
            className="styled-input"
            autoFocus
            placeholder="Search Company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            suffix={
              loading ? (
                <Spin size="small" />
              ) : (
                <StyledReload
                  onClick={() => {
                    flushSync(() => {
                      setIgnoreNextClose(true);
                    });
                    handleSelect({ companyName: "All", branchName: null });
                    if (hasRole(["COMPANY_ADMIN"])) {
                      fetchBranches("");
                    } else if (hasRole(["ADMIN"])) {
                      fetchCompanies("");
                    }
                  }}
                />
              )
            }
            inputWidth={inputWidth}
          />
        </Dropdown>
      ) : (
        <CompanyDropdownButton ref={buttonRef} onClick={handleButtonClick}>
          {`${selectedItem?.companyName} ${selectedItem?.branchName ? `- ${selectedItem.branchName}` : ""}` ||
            "Select Company"}

          <IconWrapper>
            <AiOutlineSearch style={{ strokeWidth: 30 }} />
          </IconWrapper>
        </CompanyDropdownButton>
      )}
    </div>
  );
};

export default CompanyDropdown;
