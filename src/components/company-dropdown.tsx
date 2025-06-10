import React, { useState, useEffect, useCallback, useRef } from "react";
import { Dropdown, Input, Menu, Spin } from "antd";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import { branchService, companyService } from "services";
import { getCompanyId, hasRole } from "utils/permissionUtils";
import { AiOutlineReload } from "react-icons/ai";
import { useLanguage } from "hooks";

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
const StyledInput = styled(Input).withConfig({
  shouldForwardProp: (prop) => prop !== "inputWidth",
})<{ inputWidth: string }>`
  &&.ant-input-affix-wrapper {
    &:hover {
      border-color: #4d3abd;
    }

    &.ant-input-affix-wrapper-focused {
      border-color: #4d3abd;
      box-shadow: none;
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
    outline: none;
    box-shadow: none;
    border-color: #4d3abd !important;
  }
`;

const StyledReload = styled(AiOutlineReload)`
  cursor: pointer;
`;

interface CompanyDropdownProps {
  selectedItem: any;
  onSelect: (company: string | null) => void;
}

const CompanyDropdown: React.FC<CompanyDropdownProps> = ({
  selectedItem,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>([]);
  const [searchMode, setSearchMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<any>(null);
  const [inputWidth, setInputWidth] = useState("0px");
  const { t } = useLanguage();

  useEffect(() => {
    if (selectedItem && selectedItem.id) {
      //  sadece ID doluysa
      if (selectedItem.id !== selectedCompany?.id) {
        setSelectedCompany(selectedItem);
      }
    }
  }, [selectedItem]);
  useEffect(() => {
    if (buttonRef.current) {
      const buttonWidth = buttonRef.current.offsetWidth;
      setInputWidth(`${buttonWidth + 35}px`);
    }
  }, [searchMode]);

  const fetchData = useCallback(
    async (query: string, fetchService: (query: string) => Promise<any>) => {
      if (!query) {
        setResponse([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetchService(query);
        setResponse(response.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchCompanies = useCallback((query: string) => {
    return companyService.search({ companyName: query || null });
  }, []);

  const fetchBranches = useCallback((query: string, companyId?: string) => {
    return branchService.search({
      branchName: query || null,
      companyId: companyId || getCompanyId(),
    });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const fetchService = hasRole(["COMPANY_ADMIN"])
        ? (query: string) => fetchBranches(query)
        : selectedCompany
          ? (query: any) =>
              fetchBranches(
                query,
                selectedCompany.companyId || selectedCompany.id // önce companyId varsa onu, yoksa id
              )
          : fetchCompanies;
      fetchData(searchQuery, fetchService);
    } else {
      if (!selectedCompany) {
        fetchData("", fetchCompanies);
      } else {
        setResponse([]);
      }
    }
  }, [searchQuery, fetchData, fetchBranches, fetchCompanies, selectedCompany]);

  const handleButtonClick = () => {
    setSearchMode(true);
    setTimeout(() => {
      setInputWidth("200px");
    }, 10);
  };

  const handleRefreshClick = () => {
    setSelectedCompany(null);
    setSearchQuery("");
    onSelect(null);
    handleSearchMode(false);
    fetchData("", fetchCompanies);
  };

  const handleSearchMode = (mode: boolean) => {
    setSearchMode(mode);
    setInputWidth(mode ? "200px" : "0px");
    if (!mode) setSearchQuery("");
  };

  const handleSelect = (item: any) => {
    if (!selectedCompany && !hasRole(["COMPANY_ADMIN"])) {
      setSelectedCompany(item);
      setSearchQuery("");
      onSelect(item);
      fetchData("", (query: string) => fetchBranches(query, item.id));
    } else {
      onSelect(item);
      handleSearchMode(false);
    }
  };

  const dropdownItems = response.map((item: any) => ({
    key: item.id,
    label: (
      <div style={{ width: "100%" }} onClick={() => handleSelect(item)}>
        {item.companyName}
        {item.branchName ? ` - ${item.branchName}` : ""}
      </div>
    ),
  }));

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {searchMode ? (
        <Dropdown
          menu={{ items: dropdownItems }}
          open={searchMode}
          trigger={["click"]}
        >
          <StyledInput
            ref={inputRef}
            className="styled-input"
            autoFocus
            placeholder={
              hasRole(["COMPANY_ADMIN"])
                ? t.searchBranch
                : selectedCompany
                  ? t.searchBranch
                  : t.searchCompany
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => handleSearchMode(true)}
            onBlur={(e) => {
              if (
                e.relatedTarget &&
                e.relatedTarget.closest(".ant-dropdown-menu")
              ) {
                inputRef.current?.focus();
              } else {
                handleSearchMode(false);
              }
            }}
            suffix={
              loading ? (
                <Spin size="small" />
              ) : (
                <StyledReload
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                  onClick={handleRefreshClick}
                />
              )
            }
            inputWidth={inputWidth}
          />
        </Dropdown>
      ) : (
        <CompanyDropdownButton ref={buttonRef} onClick={handleButtonClick}>
          {selectedItem.companyName === "Loading" ? (
            <Spin size="small" />
          ) : (
            `${selectedItem?.companyName || selectedCompany?.companyName || (hasRole(["ADMIN"]) ? t.selectCompany : t.selectBranch)} ${
              selectedItem?.branchName || selectedCompany?.branchName
                ? `- ${selectedItem?.branchName || selectedCompany?.branchName}`
                : ""
            }`
          )}

          <IconWrapper>
            <AiOutlineSearch style={{ strokeWidth: 30 }} />
          </IconWrapper>
        </CompanyDropdownButton>
      )}
    </div>
  );
};

export default CompanyDropdown;
