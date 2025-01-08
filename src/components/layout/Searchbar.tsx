import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Spin, InputRef, Avatar } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
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
import { hasRole } from "utils/permissionUtils";

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
  const [selectedCategory, setSelectedCategory] = useState("company");
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (location.pathname.includes("users")) {
      setSelectedCategory("users");
    } else if (location.pathname.includes("trainers")) {
      setSelectedCategory("trainers");
    } else {
      setSelectedCategory("companies");
    }
  }, [location.pathname]);

  const fetchResults = async (name: string) => {
    setLoading(true);
    try {
      let fetchedResults = [];

      if (selectedCategory === "companies") {
        const inputPayload = { companyName: name };
        const response = await companyService.search(inputPayload);
        fetchedResults = response.data || [];
      } else if (selectedCategory === "trainers") {
        const inputPayload = { ucSearchRequest: { name: name } };
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
    if (dropdownOpen) {
      fetchResults(searchValue);
      inputRef.current?.focus();
    }
  }, [selectedCategory]);

  const handleSearchIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    inputRef.current?.focus();
    fetchResults(searchValue);
  };

  const handleResultClick = (id: string) => {
    setDropdownOpen(false);
    setSearchValue("");
    setResults([]);
    navigate(`/${selectedCategory}/${id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchResults(searchValue);
    }
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

    if (selectedCategory === "companies") {
      return results.map((company: any) => (
        <ResultItem
          key={company.id}
          onClick={() => handleResultClick(company.id)}
        >
          <Avatar>{company.companyName[0].toUpperCase()}</Avatar>
          <div>
            <strong>{company.companyName}</strong>
          </div>
        </ResultItem>
      ));
    } else if (selectedCategory === "trainers") {
      return results.map((trainer: any) => (
        <ResultItem
          key={trainer.id}
          onClick={() => handleResultClick(trainer.id)}
        >
          <Avatar>{trainer.ucGetResponse?.name[0].toUpperCase()}</Avatar>
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
        {hasRole(["ADMIN"]) && (
          <CategoryItem
            isSelected={selectedCategory === "companies"}
            onClick={() => setSelectedCategory("companies")}
          >
            Company
          </CategoryItem>
        )}
        <CategoryItem
          isSelected={selectedCategory === "trainers"}
          onClick={() => setSelectedCategory("trainers")}
        >
          Trainer
        </CategoryItem>
        <CategoryItem
          isSelected={selectedCategory === "users"}
          onClick={() => setSelectedCategory("users")}
        >
          User
        </CategoryItem>
      </TransparentMenu>
      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {searchValue.length === 0 ? (
          /*  <div style={{ textAlign: "center", marginTop: 8 }}>
            Aramak yapmak için bir şeyler yazın
          </div> */ <></>
        ) : results.length > 0 ? (
          renderResults()
        ) : (
          <div style={{ textAlign: "center", marginTop: 8 }}>Sonuç yok</div>
        )}
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
          onChange={(e) => {
            setSearchValue(e.target.value);
            fetchResults(e.target.value);
          }}
          focused={dropdownOpen}
          onKeyDown={handleKeyDown}
        />
        <SearchIcon visible={dropdownOpen} onClick={handleSearchIconClick}>
          <SearchOutlined />
        </SearchIcon>
      </SearchContainer>
    </Dropdown>
  );
};

export default SearchBar;
