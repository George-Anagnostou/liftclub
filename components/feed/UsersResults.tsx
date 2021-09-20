import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { queryUsersByUsername } from "../../utils/api";
// Hooks
import { useDebouncedState } from "../hooks/useDebouncedState";
// Interfaces
import { Team } from "../../utils/interfaces";

interface Props {
  searchInput: string;
}

const UsersResults: React.FC<Props> = ({ searchInput }) => {
  const [searchResults, setSearchResults] = useState<Team["trainers"] | null>(null);
  const debouncedInput = useDebouncedState(searchInput, 200);

  useEffect(() => {
    const search = async () => {
      const users = await queryUsersByUsername(debouncedInput);
      if (users && debouncedInput) setSearchResults(users);
    };

    debouncedInput ? search() : setSearchResults(null);
  }, [debouncedInput]);

  useEffect(() => {
    // Get most recently viewed profiles
  }, []);
  return (
    <Container>
      {searchResults && searchInput ? (
        <SearchResults>
          {Boolean(searchResults.length) ? (
            searchResults.map((user) => (
              <Link href={`users/${user.username}`} key={user._id}>
                <li className="result">
                  {user.profileImgUrl ? (
                    <img src={user.profileImgUrl} alt={user.username} />
                  ) : (
                    <Image src="/favicon.png" height="30" width="30"></Image>
                  )}

                  <p>{user.username}</p>
                </li>
              </Link>
            ))
          ) : (
            <li className="result no-matches">
              <p>No matches</p>
            </li>
          )}
        </SearchResults>
      ) : (
        <p>This is under development. Feel free to search a user.</p>
      )}
    </Container>
  );
};

export default UsersResults;

const Container = styled.section`
  width: 100%;
  flex: 1;
  padding: 0.5rem 0;
`;

const SearchResults = styled.ul`
  display: flex;
  flex-direction: column;

  .result {
    background: ${({ theme }) => theme.background};
    margin: 0.25rem 0.5rem;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.1rem;
    border-radius: 8px;

    img {
      height: 30px;
      width: 30px;
      border-radius: 50%;
    }

    p {
      margin-left: 0.5rem;
      text-align: left;
      flex: 1;
    }
  }
  .no-matches p {
    text-align: center;
  }
`;
