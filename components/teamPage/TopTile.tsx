import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
// API
import { getUsersFromIdArr } from "../../utils/api";
// Context
import { useUserDispatch, useUserState } from "../../store";
import { Team, ShortUser } from "../../utils/interfaces";
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
  teamMembers: ShortUser[] | null;
  setTeamMembers: React.Dispatch<React.SetStateAction<ShortUser[] | null>>;
}

const TopTile: React.FC<Props> = ({ team, setTeam, teamMembers, setTeamMembers }) => {
  const { user } = useUserState();
  const dispatch = useUserDispatch();

  const [showMembers, setShowMembers] = useState(false);

  const handleJoinTeam = async (team_id: string) => {
    const joined = await userJoiningTeam(dispatch, user!._id, team_id);
    if (joined) {
      setTeam((prev) => prev && { ...prev, members: [...prev.members, user!._id] });
      setTeamMembers(
        (prev) =>
          prev && [
            ...prev,
            { _id: user!._id, username: user!.username, profileImgUrl: user!.profileImgUrl },
          ]
      );
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
            <Link href={`/users/${team.creatorName}`}>
              <a className="leader">
                <span>Led by: </span>
                {team.creatorName}
              </a>
            </Link>
          </p>

          <p className="membersCount" onClick={() => setShowMembers(true)}>
            {team.members.length} <span>{team.members.length === 1 ? "member" : "members"}</span>
          </p>
        </div>

        {(() => {
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
  padding: 1rem 0.5rem 0.5rem;
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
    font-size: 0.8rem;
  }

  h1 {
    margin: 0.5rem;
    font-weight: 300;
    font-size: 1.75rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: pre-wrap;
    text-overflow: ellipsis;
  }

  .info {
    text-align: left;
    width: 100%;

    div {
      width: 100%;
      display: flex;
      justify-content: space-between;

      p {
        margin-right: 0.25rem;
        span {
          color: ${({ theme }) => theme.textLight};
          font-size: 0.75rem;
        }
      }
    }

    .leader:active,
    .membersCount:active {
      text-decoration: underline;
    }

    button {
      float: right;
      border-radius: 5px;
      border: none;
      margin-top: 0.25rem;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      border-radius: 5px;

      &.join {
        color: ${({ theme }) => theme.accentText};
        background: ${({ theme }) => theme.accent};
      }
      &.joined {
        color: ${({ theme }) => theme.textLight};
        background: ${({ theme }) => theme.buttonMed};
      }
    }
  }
`;
