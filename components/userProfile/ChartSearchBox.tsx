import React from "react";
import styled from "styled-components";

interface Props {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const ChartSearchBox: React.FC<Props> = ({ searchTerm, setSearchTerm }) => {
  return (
    <SearchBox>
      <label htmlFor="Search an Exercise">Search an Exercise</label>
      <div className="input-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          name="Search an Exercise"
          className="text-input"
          placeholder="Search..."
          autoComplete="off"
        />
        <span
          onClick={() => setSearchTerm("")}
          className={` ${searchTerm.length ? "highlight" : ""}`}
        >
          ✕
        </span>
      </div>
    </SearchBox>
  );
};

export default ChartSearchBox;

const SearchBox = styled.div`
  width: 100%;
  position: relative;
  padding: 0.25rem;

  label {
    font-weight: 200;
    font-size: 0.8rem;
    letter-spacing: 1px;
  }

  .input-bar {
    display: flex;
    align-items: center;

    .text-input {
      font-size: inherit;
      font-weight: 300;
      flex: 1;
      width: 100%;
      background: ${({ theme }) => theme.buttonMed};
      border: none;
      padding: 0.25rem 0.5rem;
      color: inherit;
      border-radius: 5px;
      border: 1px solid ${({ theme }) => theme.border};
      box-shadow: none;

      &:focus {
        outline: none;
        border: 1px solid ${({ theme }) => theme.accent};
      }
      &::placeholder {
        color: ${({ theme }) => theme.border};
      }
    }
    span {
      position: absolute;
      right: 0.23rem;
      color: ${({ theme }) => theme.border};
      text-align: center;
      padding: 0 6px;
      transition: all 0.25s ease;

      &.highlight {
        color: ${({ theme }) => theme.textLight};
      }
    }
  }
`;
