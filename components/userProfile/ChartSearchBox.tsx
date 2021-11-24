import React from "react";
import styled from "styled-components";

interface Props {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const ChartSearchBox: React.FC<Props> = ({ searchTerm, setSearchTerm }) => {
  return (
    <SearchBox>
      <label htmlFor="Workout and Exercise Search">Exercise or workout name</label>
      <div className="input-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          name="Workout and Exercise Search"
          className="text-input"
          placeholder=""
          autoComplete="off"
        />
        <span onClick={() => setSearchTerm("")}>✕</span>
      </div>
    </SearchBox>
  );
};

export default ChartSearchBox;

const SearchBox = styled.div`
  width: 100%;
  position: relative;

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
      background: inherit;
      border: none;
      padding: 0.15rem 0.5rem;
      color: inherit;
      border-radius: 3px;
      border: 1px solid ${({ theme }) => theme.border};

      &:focus {
        outline: none;
        border: 1px solid ${({ theme }) => theme.accent};
      }
    }
    span {
      position: absolute;
      right: 0.23rem;
      color: ${({ theme }) => theme.textLight};
      text-align: center;
      padding: 0 6px;
    }
  }
`;
