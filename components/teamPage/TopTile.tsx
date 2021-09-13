import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
// API
import { getUsersFromIdArr } from "../../utils/api";
// Context
import { useStoreDispatch, useStoreState } from "../../store";
import { Team, User } from "../../utils/interfaces";
// Components
import MembersModal from "./MembersModal";
import {
  addUserFollow,
  removeUserFollow,
  userJoiningTeam,
  userLeavingTeam,
} from "../../store/actions/userActions";

interface Props {
  team: Team;
  setTeam: React.Dispatch<React.SetStateAction<Team | null>>;
  teamMembers: User[] | null;
  setTeamMembers: React.Dispatch<React.SetStateAction<User[] | null>>;
}

const TopTile: React.FC<Props> = ({ team, setTeam, teamMembers, setTeamMembers }) => {
  const { user } = useStoreState();
  const dispatch = useStoreDispatch();

  const [showMembers, setShowMembers] = useState(false);

  const handleJoinTeam = async (team_id: string) => {
    const joined = await userJoiningTeam(dispatch, user!._id, team_id);
    if (joined) {
      setTeam((prev) => prev && { ...prev, members: [...prev.members, user!._id] });
      setTeamMembers((prev) => prev && [...prev, user!]);
    }
  };

  const handleLeaveTeam = async (team_id: string) => {
    const left = await userLeavingTeam(dispatch, user!._id, team_id);

    if (left) {
      setTeam(
        (prev) =>
          prev && {
            ...prev,
            members: [...prev.members.filter((_id) => _id !== user!._id)],
          }
      );
      setTeamMembers((prev) => prev && prev.filter((member) => member._id !== user!._id));
    }
  };

  const handleFollowClick = (member_id: string) => {
    addUserFollow(dispatch, user!._id, member_id);
  };

  const handleUnfollowClick = (member_id: string) => {
    removeUserFollow(dispatch, user!._id, member_id);
  };

  useEffect(() => {
    const getTeamMembers = async () => {
      const members = await getUsersFromIdArr(team.members);
      if (members) setTeamMembers(members);
    };

    if (showMembers && !teamMembers) getTeamMembers();
  }, [showMembers]);

  return (
    <Tile>
      <h1>{team.teamName}</h1>

      {user?._id === team.creator_id && (
        <Link href={`/builder?builder=team&team=${team._id}`}>
          <button className="editBtn">Edit</button>
        </Link>
      )}

      <div className="info">
        <div>
          <p>
            Leader -{" "}
            <Link href={`/users/${team.creatorName}`}>
              <a className="leader">{team.creatorName}</a>
            </Link>
          </p>

          <p className="membersCount" onClick={() => setShowMembers(true)}>
            {team.members.length} {team.members.length === 1 ? "member" : "members"}
          </p>
        </div>

        {(function () {
          const joined = user?.teamsJoined?.includes(team._id);
          return (
            <button
              onClick={joined ? () => handleLeaveTeam(team._id) : () => handleJoinTeam(team._id)}
              className={joined ? "joined" : "join"}
            >
              {joined ? "Joined" : "Join"}
            </button>
          );
        })()}
      </div>

      {showMembers && (
        <MembersModal
          setShowMembers={setShowMembers}
          showMembers={showMembers}
          teamMembers={teamMembers}
          handleUnfollowClick={handleUnfollowClick}
          handleFollowClick={handleFollowClick}
        />
      )}
    </Tile>
  );
};
export default TopTile;

const Tile = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.background};
  padding: 1rem 0.5rem;
  border-radius: 10px;
  position: relative;

  .editBtn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    border-radius: 5px;
    padding: 0.1rem 0.5rem;
    border: none;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.textLight};
  }

  h1 {
    margin: 0.5rem;
    font-weight: 300;
    font-size: 2rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: pre-wrap;
    text-overflow: ellipsis;
  }

  .info {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;

    p {
      margin-right: 0.25rem;
    }

    .leader:active,
    .membersCount:active {
      text-decoration: underline;
    }

    button {
      border-radius: 5px;
      padding: 0.5rem 0.75rem;
      border: none;
      margin-left: auto;

      &.join {
        padding: 0.25rem 1rem;
        font-size: 0.9rem;
        border-radius: 5px;
        color: ${({ theme }) => theme.accentText};
        background: ${({ theme }) => theme.accent};
        border: 1px solid ${({ theme }) => theme.accentSoft};
      }
      &.joined {
        padding: 0.25rem 0.5rem;
        font-size: 0.9rem;
        border-radius: 5px;
        color: ${({ theme }) => theme.textLight};
        background: ${({ theme }) => theme.buttonMed};
        border: 1px solid ${({ theme }) => theme.buttonMed};
      }
    }
  }
`;
