import { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
// Components
import Magnifying from "../svg/Magnifying";
// Interfaces
import { Team } from "../../utils/interfaces";

interface Props {}

const SearchBar: React.FC<Props> = ({}) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<Team["trainers"] | null>(null);

  return (
    <SearchContainer>
      <SearchInput>
        <span className="icon">
          <Magnifying />
        </span>

        <div className="input">
          <input
            type="text"
            name="add-trainer"
            placeholder="Search"
            value={searchInput}
            autoComplete="off"
            onChange={(e) =>
              setSearchInput(
                e.target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
              )
            }
          />

          <span className="clear" onClick={() => setSearchInput("")}>
            <span></span>
            <span></span>
          </span>
        </div>
      </SearchInput>

      {/* {searchResults && searchInput && (
        <SearchResults>
          {Boolean(searchResults.length) ? (
            searchResults.map((trainer) => (
              <li className="result" key={trainer._id}>
                {trainer.profileImgUrl ? (
                  <img src={trainer.profileImgUrl} alt={trainer.username} />
                ) : (
                  <Image src="/favicon.png" height="30" width="30"></Image>
                )}

                <p>{trainer.username}</p>
              </li>
            ))
          ) : (
            <li className="result">
              <p>No matches</p>
            </li>
          )}
        </SearchResults>
      )} */}
    </SearchContainer>
  );
};
export default SearchBar;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
  /* border-bottom: 1px solid ${({ theme }) => theme.buttonMed}; */
  padding: 0.5rem 0.25rem;
  height: 3.25rem;
  position: sticky;
  top: -2.75rem;
`;

const SearchResults = styled.ul`
  background: ${({ theme }) => theme.buttonMed};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 5px 10px ${({ theme }) => theme.boxShadow};
  z-index: 99;
  border-radius: 5px;
  margin: 0.25rem 1.75rem 0 2rem;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  max-height: calc(2.25rem * 8);
  overflow-y: scroll;

  .result {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    font-size: 1rem;

    img {
      height: 20px;
      width: 20px;
      border-radius: 50%;
    }

    p {
      margin-left: 0.5rem;
      text-align: left;
      flex: 1;
    }

    button {
      font-size: 0.6rem;
      font-weight: 300;
      background: ${({ theme }) => theme.buttonLight};
      color: ${({ theme }) => theme.textLight};
      border: none;
      border-radius: 3px;
      margin-left: 0.3rem;
      padding: 0.1rem 0.25rem;

      &.add {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accentText};
      }
    }
  }
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;

  .icon {
    display: grid;
    place-items: center;
    margin: 0 0.5rem 0 0.25rem;
    svg {
      fill: ${({ theme }) => theme.textLight};
      height: 20px;
      width: 20px;
    }
  }

  .input {
    flex: 1;
    border-radius: 5px;
    display: flex;
    align-items: center;
    height: 2.25rem;

    input {
      appearance: none;
      background: ${({ theme }) => theme.buttonMed};
      color: ${({ theme }) => theme.text};
      border: 1px solid ${({ theme }) => theme.buttonMed};
      padding: 0.25rem 0.5rem;
      width: 100%;
      margin: 0;
      font-size: 1rem;
      border-radius: 5px;

      &:focus {
        outline: none;
        border: 1px solid ${({ theme }) => theme.accentSoft};
      }
    }

    .clear {
      width: 2rem;
      height: 2.25rem;
      position: relative;

      span {
        position: absolute;
        display: block;
        height: 2px;
        width: 15px;
        background: ${({ theme }) => theme.textLight};
        margin: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 3px;

        &:first-child {
          transform: rotate(45deg);
        }
        &:last-child {
          transform: rotate(-45deg);
        }
      }
    }
  }
`;
