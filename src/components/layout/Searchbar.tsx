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
import {
  companyService,
  sessionService,
  trainerService,
  userService,
} from "services";
import { hasRole } from "utils/permissionUtils";

interface SearchBarProps {
  isMobile: boolean;
  searchActive: boolean;
  setSearchActive: (active: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isMobile, searchActive }) => {
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
    } else if (location.pathname.includes("sessions")) {
      setSelectedCategory("sessions");
    } else {
      setSelectedCategory("companies");
    }
  }, [location.pathname]);

  const fetchResults = async (name: string) => {
    setLoading(true);
    try {
      let fetchedResults = [];
      let inputPayload;
      let response;

      if (selectedCategory === "companies") {
        inputPayload = { companyName: name };
        response = await companyService.search(inputPayload);
      } else if (selectedCategory === "trainers") {
        inputPayload = { ucSearchRequest: { name: name } };
        response = await trainerService.search(inputPayload);
      } else if (selectedCategory === "users") {
        inputPayload = { ucSearchRequest: { name: name } };
        response = await userService.search(inputPayload);
      } else if (selectedCategory === "sessions") {
        inputPayload = { name: name };
        response = await sessionService.search(inputPayload);
      }
      fetchedResults = response ? response.data : [];
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

    if (selectedCategory === "sessions") {
      const selectedSession = results.find((session) => session.id === id);
      if (selectedSession && selectedSession.startDate) {
        const sessionDate = new Date(selectedSession.startDate)
          .toISOString()
          .slice(0, 7);
        navigate(`/sessions/${sessionDate}?session=${id}`);
      }
    } else {
      navigate(`/${selectedCategory}/${id}`);
    }
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
    } else if (selectedCategory === "users") {
      return results.map((user: any) => (
        <ResultItem key={user.id} onClick={() => handleResultClick(user.id)}>
          <Avatar>{user.ucGetResponse?.name[0].toUpperCase()}</Avatar>
          <strong>
            {user.ucGetResponse?.name} {user.ucGetResponse?.surname}
          </strong>
        </ResultItem>
      ));
    } else if (selectedCategory === "sessions") {
      return results.map((session: any) => {
        return (
          <ResultItem
            key={session.id}
            onClick={() => handleResultClick(session.id)}
          >
            <div>
              <strong>{session.name}</strong>
              <br />
              <span>
                {session.companyName} - {session.branchName}
              </span>
            </div>
          </ResultItem>
        );
      });
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
        <CategoryItem
          isSelected={selectedCategory === "sessions"}
          onClick={() => setSelectedCategory("sessions")}
        >
          Session
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
