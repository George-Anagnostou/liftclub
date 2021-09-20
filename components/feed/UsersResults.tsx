import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
// API
import { getUsersFromIdArr, queryUsersByUsername } from "../../utils/api";
// Context
import { useStoreDispatch, useStoreState } from "../../store";
import { addToRecentlyViewedUsers } from "../../store/actions/userActions";
// Hooks
import { useDebouncedState } from "../hooks/useDebouncedState";
// Interfaces
import { Team, ShortUser } from "../../utils/interfaces";

interface Props {
  searchInput: string;
}

const UsersResults: React.FC<Props> = ({ searchInput }) => {
  const { user } = useStoreState();
  const dispatch = useStoreDispatch();

  const [recentlyViewedUsers, setRecentlyViewedUsers] = useState<ShortUser[]>([]);
  const [searchResults, setSearchResults] = useState<Team["trainers"] | null>(null);
  const debouncedInput = useDebouncedState(searchInput, 500);

  useEffect(() => {
    const search = async () => {
      const users = await queryUsersByUsername(debouncedInput);
      if (users && debouncedInput) setSearchResults(users);
    };

    debouncedInput ? search() : setSearchResults(null);
  }, [debouncedInput]);

  useEffect(() => {
    const getRecentlyViewed = async () => {
      if (user?.recentlyViewedUsers) {
        const users = await getUsersFromIdArr(user.recentlyViewedUsers);
        if (users) setRecentlyViewedUsers(users);
      } else {
        setRecentlyViewedUsers([]);
      }
    };
    if (!Boolean(recentlyViewedUsers?.length)) getRecentlyViewed();
  }, [user]);

  return (
    <Container>
      {searchResults && searchInput ? (
        // User has something typed in to the search input
        <SearchResults>
          {Boolean(searchResults.length) ? (
            searchResults.map(({ _id, username, profileImgUrl }) => (
              <Link href={`users/${username}`} key={_id}>
                <li
                  className="result"
                  onClick={() => addToRecentlyViewedUsers(dispatch, user!._id, _id)}
                >
                  {profileImgUrl ? (
                    <img src={profileImgUrl} alt={username} />
                  ) : (
                    <Image src="/favicon.png" height="40" width="40"></Image>
                  )}

                  <p>{username}</p>
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
        Boolean(recentlyViewedUsers.length) && (
          // User has nothing in search input, so show recently viewed users
          <SearchResults>
            <h3 className="recent-title">Recent</h3>
            {recentlyViewedUsers.map(({ _id, username, profileImgUrl }) => (
              <Link href={`users/${username}`} key={_id}>
                <li
                  className="result"
                  onClick={() => addToRecentlyViewedUsers(dispatch, user!._id, _id)}
                >
                  {profileImgUrl ? (
                    <img src={profileImgUrl} alt={username} />
                  ) : (
                    <Image src="/favicon.png" height="40" width="40"></Image>
                  )}

                  <p>{username}</p>
                </li>
              </Link>
            ))}
          </SearchResults>
        )
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

  .recent-title {
    text-align: left;
    margin-left: 1rem;
    font-size: 0.85rem;
    font-weight: 200;
  }

  .result {
    background: ${({ theme }) => theme.background};
    box-shadow: 0 0.5px 2px ${({ theme }) => theme.boxShadow};
    margin: 0.25rem 0.5rem;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.1rem;
    border-radius: 8px;

    img {
      height: 40px;
      width: 40px;
      border-radius: 50%;
    }

    p {
      margin-left: 1rem;
      text-align: left;
      flex: 1;
    }
  }
  .no-matches p {
    text-align: center;
  }
`;
