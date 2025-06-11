import React, { useEffect, useRef, useState } from "react";
import { Dropdown, Spin, InputRef, Avatar } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SearchContainer,
  Search,
  DropdownOverlay,
  TransparentMenu,
  CategoryItem,
  ResultItem,
  ResultContainer,
  SearchWrapper,
  ShortcutHint,
} from "./layoutStyles";
import {
  companyService,
  sessionService,
  trainerService,
  userService,
} from "services";
import { hasRole } from "utils/permissionUtils";
import { useLanguage } from "hooks";

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
  const { t, userLanguage } = useLanguage();
  const locale = userLanguage === "tr" ? "tr-TR" : "en-US";

  const [highlightedResultIndex, setHighlightedResultIndex] = useState(0);
  const resultsRef = useRef<HTMLDivElement[]>([]);

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

  useEffect(() => {
    if (isMobile && searchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile, searchActive]);

  const handleResultClick = (id: string) => {
    setDropdownOpen(false);
    setSearchValue("");
    setResults([]);

    if (selectedCategory === "sessions") {
      const selectedSession = results.find((session) => session.id === id);
      if (selectedSession && selectedSession.startDate) {
        const savedCalendarView = localStorage.getItem("savedCalendarView");
        const sessionDate = new Date(selectedSession.startDate);

        const formattedDate =
          savedCalendarView === "day" || savedCalendarView === "week"
            ? sessionDate.toISOString().slice(0, 10) // YYYY-MM-DD
            : sessionDate.toISOString().slice(0, 7); // YYYY-MM

        navigate(`/sessions/${formattedDate}?id=${id}`);
      }
    } else {
      navigate(`/${selectedCategory}/${id}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedResultIndex((prev) =>
        Math.min(prev + 1, results.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedResultIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      if (results[highlightedResultIndex]) {
        handleResultClick(results[highlightedResultIndex].id);
      }
    } else if (event.key === "ArrowRight") {
      // ileri kategori (opsiyonel)
      moveCategory(1);
    } else if (event.key === "ArrowLeft") {
      // geri kategori (opsiyonel)
      moveCategory(-1);
    } else if (event.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  const categories = ["companies", "trainers", "users", "sessions"];
  const moveCategory = (dir: number) => {
    const idx = categories.indexOf(selectedCategory);
    const next = idx + dir;
    if (next >= 0 && next < categories.length) {
      setSelectedCategory(categories[next]);
      setHighlightedResultIndex(0);
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      setDropdownOpen(true);
      inputRef.current?.focus();
    };

    window.addEventListener("focus-searchbar", handleFocus);
    return () => window.removeEventListener("focus-searchbar", handleFocus);
  }, []);

  useEffect(() => {
    if (resultsRef.current[highlightedResultIndex]) {
      resultsRef.current[highlightedResultIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedResultIndex]);

  const renderResults = () => {
    resultsRef.current = [];
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
      return results.map((company: any, index: number) => (
        <ResultItem
          key={company.id}
          onClick={() => handleResultClick(company.id)}
          ref={(el) => (resultsRef.current[index] = el!)}
          style={{
            backgroundColor:
              index === highlightedResultIndex ? "#f0f0ff" : "transparent",
          }}
        >
          <Avatar>{company.companyName[0].toUpperCase()}</Avatar>
          <div>
            <strong>{company.companyName}</strong>
          </div>
        </ResultItem>
      ));
    } else if (selectedCategory === "trainers") {
      return results.map((trainer: any, index: number) => (
        <ResultItem
          key={trainer.id}
          onClick={() => handleResultClick(trainer.id)}
          ref={(el) => (resultsRef.current[index] = el!)}
          style={{
            backgroundColor:
              index === highlightedResultIndex ? "#f0f0ff" : "transparent",
          }}
        >
          <Avatar>{trainer.ucGetResponse?.name[0].toUpperCase()}</Avatar>
          <div>
            <strong>
              {trainer.ucGetResponse?.name} {trainer.ucGetResponse?.surname}
            </strong>
            <br />
            <small style={{ color: "#888" }}>
              {trainer.companyName} - {trainer.branchName}
            </small>
          </div>
        </ResultItem>
      ));
    } else if (selectedCategory === "users") {
      return results.map((user: any, index: number) => (
        <ResultItem
          key={user.id}
          onClick={() => handleResultClick(user.id)}
          ref={(el) => (resultsRef.current[index] = el!)}
          style={{
            backgroundColor:
              index === highlightedResultIndex ? "#f0f0ff" : "transparent",
          }}
        >
          <Avatar>{user.ucGetResponse?.name[0].toUpperCase()}</Avatar>
          <div>
            <strong>
              {user.ucGetResponse?.name} {user.ucGetResponse?.surname}
              <br />
            </strong>
            <small style={{ color: "#888" }}>
              {user.companyName} - {user.branchName}
            </small>
          </div>
        </ResultItem>
      ));
    } else if (selectedCategory === "sessions") {
      return results.map((session: any, index: number) => {
        const sessionDate = new Date(session.startDate).toLocaleDateString(
          locale,
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );
        const startTime = new Date(session.startDate).toLocaleTimeString(
          locale,
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );
        const endTime = new Date(session.endDate).toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <ResultItem
            key={session.id}
            onClick={() => handleResultClick(session.id)}
            ref={(el) => (resultsRef.current[index] = el!)}
            style={{
              backgroundColor:
                index === highlightedResultIndex ? "#f0f0ff" : "transparent",
            }}
          >
            <div>
              <strong>{session.name}</strong>
              <br />
              <small style={{ color: "#888" }}>
                {session.companyName} - {session.branchName}
              </small>
            </div>
            <div
              style={{ textAlign: "right", marginLeft: "auto", color: "#888" }}
            >
              <small style={{ color: "black" }}>{sessionDate}</small>
              <br />
              <small>
                {startTime} - {endTime}
              </small>
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
            {t.company}
          </CategoryItem>
        )}
        <CategoryItem
          isSelected={selectedCategory === "trainers"}
          onClick={() => setSelectedCategory("trainers")}
        >
          {t.trainer}
        </CategoryItem>
        <CategoryItem
          isSelected={selectedCategory === "users"}
          onClick={() => setSelectedCategory("users")}
        >
          {t.customer}
        </CategoryItem>
        <CategoryItem
          isSelected={selectedCategory === "sessions"}
          onClick={() => setSelectedCategory("sessions")}
        >
          {t.session}
        </CategoryItem>
      </TransparentMenu>
      <ResultContainer>
        {searchValue.length === 0 ? (
          /*  <div style={{ textAlign: "center", marginTop: 8 }}>
            Aramak yapmak için bir şeyler yazın
          </div> */ <></>
        ) : results.length > 0 ? (
          renderResults()
        ) : (
          <div style={{ textAlign: "center", marginTop: 8 }}>Sonuç yok</div>
        )}
      </ResultContainer>
    </DropdownOverlay>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownOverlay}
      trigger={["click"]}
      placement="bottom"
      onOpenChange={(visible) => {
        setDropdownOpen(visible);
        if (!visible) {
          setSearchValue("");
          setResults([]);
        }
      }}
      open={dropdownOpen}
    >
      <SearchContainer
        isMobile={isMobile}
        searchActive={isMobile ? searchActive : true}
        onClick={() => setDropdownOpen(true)}
      >
        <SearchWrapper>
          <Search
            ref={inputRef}
            placeholder={t.searchSomething}
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              fetchResults(e.target.value);
            }}
            focused={dropdownOpen}
            onKeyDown={handleKeyDown}
          />
          <ShortcutHint>Ctrl + K</ShortcutHint>
        </SearchWrapper>
      </SearchContainer>
    </Dropdown>
  );
};

export default SearchBar;
