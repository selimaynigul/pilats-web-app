import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Spin, InputRef } from "antd";
import { useNavigate } from "react-router-dom";
import {
  SearchContainer,
  Search,
  SearchIcon,
  DropdownOverlay,
  TransparentMenu,
  CategoryItem,
  ResultItem,
} from "./layoutStyles";
import { SearchOutlined } from "@ant-design/icons";
import { companyService, trainerService } from "services";

interface SearchBarProps {
  isMobile: boolean;
  searchActive: boolean;
  setSearchActive: (active: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  isMobile,
  searchActive,
  setSearchActive,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("company");
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<InputRef>(null);

  const fetchResults = async () => {
    setLoading(true);
    try {
      let fetchedResults = [];
      const inputPayload = { ucSearchRequest: { name: searchValue } };

      if (selectedCategory === "company") {
        const response = await companyService.getByPagination(inputPayload);
        fetchedResults = response.data || [];
      } else if (selectedCategory === "trainer") {
        const response = await trainerService.search(inputPayload);
        fetchedResults = response.data || [];
      }
      setResults(fetchedResults);
      setDropdownOpen(true);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setResults([]);
  }, [selectedCategory]);

  const handleSearchIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    inputRef.current?.focus();
    fetchResults();
  };

  const handleResultClick = (id: string) => {
    setDropdownOpen(false);
    setSearchValue("");
    setResults([]);
    navigate(`/trainers/${id}`);
  };

  const renderResults = () => {
    if (loading) {
      return (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <Spin />
        </div>
      );
    }

    if (selectedCategory === "company") {
      return results.map((company: any) => (
        <ResultItem key={company.id}>
          <div>
            <strong>{company.companyName}</strong>
          </div>
        </ResultItem>
      ));
    } else if (selectedCategory === "trainer") {
      return results.map((trainer: any) => (
        <ResultItem
          key={trainer.id}
          onClick={() => handleResultClick(trainer.id)}
        >
          <div>
            <strong>
              {trainer.ucGetResponse?.name} {trainer.ucGetResponse?.surname}
            </strong>
            <br />
            <span>
              {trainer.companyName} - {trainer.branchName}
            </span>
          </div>
        </ResultItem>
      ));
    } else {
      return results.map((user: any) => (
        <ResultItem key={user.id}>
          <div>
            <strong>{user.name}</strong>
          </div>
        </ResultItem>
      ));
    }
  };

  const dropdownOverlay = (
    <DropdownOverlay>
      <TransparentMenu>
        <CategoryItem
          isSelected={selectedCategory === "company"}
          onClick={() => setSelectedCategory("company")}
        >
          Company
        </CategoryItem>
        <CategoryItem
          isSelected={selectedCategory === "trainer"}
          onClick={() => setSelectedCategory("trainer")}
        >
          Trainer
        </CategoryItem>
        <CategoryItem
          isSelected={selectedCategory === "user"}
          onClick={() => setSelectedCategory("user")}
        >
          User
        </CategoryItem>
      </TransparentMenu>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {renderResults()}
      </div>
    </DropdownOverlay>
  );

  return (
    <Dropdown
      overlay={dropdownOverlay}
      trigger={["click"]}
      placement="bottomCenter"
      onOpenChange={(visible) => setDropdownOpen(visible)}
      open={dropdownOpen}
    >
      <SearchContainer
        isMobile={isMobile}
        searchActive={isMobile ? searchActive : true}
        onClick={() => setDropdownOpen(true)}
      >
        <Search
          ref={inputRef}
          placeholder="Search something"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          focused={dropdownOpen}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <SearchIcon visible={dropdownOpen} onClick={handleSearchIconClick}>
          <SearchOutlined />
        </SearchIcon>
      </SearchContainer>
    </Dropdown>
  );
};

export default SearchBar;
