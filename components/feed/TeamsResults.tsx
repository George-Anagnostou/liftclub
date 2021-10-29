import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
// API
import { getAllTeamsByMemberCount } from "../../utils/api";
import { Team } from "../../utils/interfaces";

interface Props {
  searchInput: string;
  limit: number;
}

const TeamsResults: React.FC<Props> = ({ searchInput, limit }) => {
  const [initialTeams, setInitialTeams] = useState<Team[]>([]);

  useEffect(() => {
    const getTeams = async () => {
      const teams = await getAllTeamsByMemberCount();
      console.log(teams);
      if (teams) setInitialTeams(teams);
    };
    getTeams();
  }, []);

  return (
    <Container>
      <SearchResults>
        {Boolean(initialTeams.length)
          ? initialTeams.slice(0, limit || initialTeams.length).map((team) => (
              <Link href={`/teams/${team._id}`} key={team._id}>
                <li className="result">
                  <p>{team.teamName}</p>
                  <p className="members">
                    {team.members.length} <span>members</span>
                  </p>
                </li>
              </Link>
            ))
          : searchInput && <p style={{ margin: "1rem 0", fontWeight: 300 }}>No results</p>}
      </SearchResults>
    </Container>
  );
};

export default TeamsResults;

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
    padding: 0.25rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;

    p {
      font-weight: 300;
      span {
        font-size: 0.65rem;
      }
    }
    .members {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.textLight};
      font-weight: 200;
    }
  }

  .no-matches p {
    text-align: center;
  }
`;
