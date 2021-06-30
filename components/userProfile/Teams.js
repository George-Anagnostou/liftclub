import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
// Context
import { useStoreState } from "../../store";
// API
import { getUserMadeTeams, userJoiningTeam, userLeavingTeam } from "../../utils/api";

export default function Teams({ profileData, isProfileOwner }) {
  const { user } = useStoreState();

  const [profileOwnedTeams, setProfileOwnedTeams] = useState([]);

  const handleJoinTeam = async (team_id) => {
    const joined = await userJoiningTeam(user._id, team_id);

    if (joined) {
      setProfileOwnedTeams((prev) => {
        const index = prev.findIndex((team) => team._id === team_id);
        prev[index].members = [...prev[index].members, user._id];

        return [...prev];
      });
    }
  };

  const handleLeaveTeam = async (team_id) => {
    const left = await userLeavingTeam(user._id, team_id);

    if (left) {
      setProfileOwnedTeams((prev) => {
        const index = prev.findIndex((team) => team._id === team_id);
        prev[index].members = [...prev[index].members.filter((id) => id !== user._id)];

        return [...prev];
      });
    }
  };

  useEffect(() => {
    const getTeams = async () => {
      const teamsRes = await getUserMadeTeams(profileData._id);
      setProfileOwnedTeams(teamsRes);
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
            <Team key={team._id}>
              <div className="teamInfo">
                <p className="name">{team.teamName}</p>
                <p className="members">
                  {team.members.length} {team.members.length === 1 ? "member" : "members"}
                </p>
              </div>

              <div className="buttons">
                <Link href={`/teams/${team._id}`}>
                  <button className="view">view</button>
                </Link>

                <button
                  onClick={
                    team.members.includes(user._id)
                      ? () => handleLeaveTeam(team._id)
                      : () => handleJoinTeam(team._id)
                  }
                  className={team.members.includes(user._id) ? "joined" : "join"}
                >
                  {team.members.includes(user._id) ? "joined" : "join"}
                </button>
              </div>
            </Team>
          ))
        ) : (
          <p className="noTeams">None</p>
        )}
      </TeamsList>
    </Container>
  );
}

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

const Team = styled.li`
  background: ${({ theme }) => theme.buttonMed};
  box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  text-align: center;
  width: 160px;

  .teamInfo {
    p {
      margin: 0.25rem 0;
    }

    .name {
      font-size: 1.35rem;
    }

    .members {
      margin-left: 0.5rem;
      color: ${({ theme }) => theme.textLight};
      font-size: 0.8rem;
    }
  }

  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      flex: 1;
    }

    button {
      flex: 1;
      border-radius: 5px;
      margin: 0.25rem 0;
      padding: 0.5rem 0.75rem;
      border: none;

      &.view {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accentText};
      }
      &.join {
        background: ${({ theme }) => theme.accent};
        color: ${({ theme }) => theme.accentText};
      }
      &.joined {
        background: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.textLight};
      }

      &:first-of-type {
        margin-right: 0.5rem;
      }
    }
  }
`;
