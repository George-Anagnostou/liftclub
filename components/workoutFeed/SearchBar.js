import { useState, useEffect } from "react";
import styled from "styled-components";
import SearchIcon from "./SearchIcon";

export default function SearchBar({ workouts, setFilteredWorkouts }) {
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  useEffect(() => {
    if (workouts.length) {
      const lowercasedFilter = filter.toLowerCase();

      const filteredData = workouts.filter((workout) => {
        return workout.name.toLowerCase().includes(lowercasedFilter);
      });

      setFilteredWorkouts(filteredData);
    }
  }, [filter, workouts]);

  return (
    <SearchContainer>
      <div className="searchBar">
        <SearchIcon />
        <input type="text" name="filter" onChange={handleFilterChange} value={filter} />
      </div>
      <button onClick={() => setFilter("")}>Cancel</button>
    </SearchContainer>
  );
}

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  color: ${({ theme }) => theme.text};
  fill: ${({ theme }) => theme.text};

  .searchBar {
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${({ theme }) => theme.buttonLight};

    width: fit-content;
    margin: 0.5rem;
    padding: 0 1rem;
    border-radius: 10px;

    input {
      border: none;
      outline: none;
      padding: 0.5rem 0 0.5rem 0.5rem;
      font-size: inherit;
      background: inherit;
      color: inherit;
    }
  }

  button {
    border: none;
    padding: 0.5rem;
    font-size: inherit;
    color: ${({ theme }) => theme.textLight};
    background: ${({ theme }) => theme.buttonLight};
    border-radius: 10px;
  }
`;
