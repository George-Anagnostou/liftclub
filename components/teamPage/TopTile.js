import React, { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
// API
import { joinTeam, leaveTeam } from "../../utils/api";
import { useStoreState } from "../../store";

export default function TopTile({ team, setTeam }) {
  const { user } = useStoreState();

  const userIsInTeam = () => team.members.findIndex((mem) => mem._id === user._id) >= 0;

  const handleJoinTeam = async (team_id) => {
    const joined = await joinTeam(user._id, team_id);

    if (joined) {
      setTeam((prev) => {
        prev.members = [...prev.members, user];
        return { ...prev };
      });
    }
  };

  const handleLeaveTeam = async (team_id) => {
    const left = await leaveTeam(user._id, team_id);

    if (left) {
      setTeam((prev) => {
        prev.members = [...prev.members.filter((mem) => mem._id !== user._id)];
        return { ...prev };
      });
    }
  };

  return (
    <Tile>
      <h1>{team.teamName}</h1>

      <div className="info">
        <div>
          <p>
            Team leader: <Link href={`/users/${team.creatorName}`}>{team.creatorName}</Link>
          </p>

          <p>
            {team.members.length} {team.members.length === 1 ? "member" : "members"}
          </p>
        </div>

        <button
          onClick={
            userIsInTeam() ? () => handleLeaveTeam(team._id) : () => handleJoinTeam(team._id)
          }
          className={userIsInTeam() ? "joined" : "join"}
        >
          {userIsInTeam() ? "joined" : "join"}
        </button>
      </div>
    </Tile>
  );
}

const Tile = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 1rem 0.5rem;
  border-radius: 10px;

  h1 {
    margin-bottom: 1rem;
    font-weight: 300;
    font-size: 2rem;
  }
  .info {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    button {
      border-radius: 5px;
      padding: 0.75rem;
      border: none;
      box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};

      &.join {
        background: ${({ theme }) => theme.accent};
        color: ${({ theme }) => theme.accentText};
      }
      &.joined {
        background: ${({ theme }) => theme.buttonMed};
        color: ${({ theme }) => theme.textLight};
        box-shadow: 0 1px 0px ${({ theme }) => theme.boxShadow};
      }
    }
  }
`;
