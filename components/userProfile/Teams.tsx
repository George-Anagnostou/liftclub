import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
// API
import { getUserMadeTeams } from "../../utils/api";
// Interfaces
import { Team, User } from "../../utils/interfaces";

interface Props {
  profileData: User;
  isProfileOwner: boolean;
}

const Teams: React.FC<Props> = ({ profileData, isProfileOwner }) => {
  const [profileOwnedTeams, setProfileOwnedTeams] = useState<Team[]>([]);

  useEffect(() => {
    const getTeams = async () => {
      const teamsRes = await getUserMadeTeams(profileData._id);
      setProfileOwnedTeams(teamsRes || []);
    };

    getTeams();
  }, [profileData]);

  return (
    <Container>
      <div className="topbar">
        <h3 className="title">Owned Teams</h3>
        {isProfileOwner && (
          <Link href="/builder?builder=team">
            <button>Make Team</button>
          </Link>
        )}
      </div>

      <TeamsList>
        {Boolean(profileOwnedTeams.length) ? (
          profileOwnedTeams.map((team) => (
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
export default Teams;

const Container = styled.div`
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
      border-radius: 5px;
      padding: 0.25rem 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 0.8rem;
      border: ${({ theme }) => theme.border};
      color: ${({ theme }) => theme.textLight};
      background: ${({ theme }) => theme.buttonMed};
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
