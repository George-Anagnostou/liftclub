import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
// API
import { getTeamsFromIdArray } from "../../utils/api";
// Interfaces
import { Team, User } from "../../utils/interfaces";

interface Props {
  profileData: User;
}

const TeamsTile: React.FC<Props> = ({ profileData }) => {
  const [profileTeamsJoined, setProfileTeamsJoined] = useState<Team[]>([]);

  useEffect(() => {
    const getTeams = async () => {
      const teamsRes = await getTeamsFromIdArray(profileData.teamsJoined || []);
      console.log(teamsRes);
      setProfileTeamsJoined(teamsRes || []);
    };

    getTeams();
  }, [profileData.username]);

  return (
    <Container>
      <div className="topbar">
        <h3 className="title">Teams Joined</h3>

        <Link href="/builder?builder=team">
          <button>+</button>
        </Link>
      </div>

      <TeamsList>
        {Boolean(profileTeamsJoined.length) ? (
          profileTeamsJoined.map((team) => (
            <TeamItem key={team._id}>
              <Link href={`/teams/${team._id}`}>
                <div className="teamInfo">
                  <p className="name">{team.teamName}</p>
                  <p className="members">
                    {team.members.length} {team.members.length === 1 ? "member" : "members"}
                  </p>
                </div>
              </Link>
            </TeamItem>
          ))
        ) : (
          <p className="noTeams">None</p>
        )}
      </TeamsList>
    </Container>
  );
};
export default TeamsTile;

const Container = styled.section`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 0.5rem;
  border-radius: 10px;
  text-align: left;

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      min-width: max-content;
      border-radius: 5px;
      padding: 0rem 0.4rem;
      margin-bottom: 0.5rem;
      border: ${({ theme }) => theme.border};
      color: ${({ theme }) => theme.textLight};
      background: ${({ theme }) => theme.buttonMed};
      font-size: 1rem;
    }
  }
`;

const TeamsList = styled.ul`
  display: flex;
  margin: 0.5rem 0;

  .noTeams {
    margin-left: 0.5rem;
  }
`;

const TeamItem = styled.li`
  background: ${({ theme }) => theme.buttonMed};
  box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  text-align: center;

  .teamInfo {
    p {
      margin: 0.25rem 0;
    }

    .name {
      font-size: 1rem;
    }

    .members {
      color: ${({ theme }) => theme.textLight};
      font-size: 0.8rem;
    }
  }
`;
