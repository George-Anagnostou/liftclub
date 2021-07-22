import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
// API
import {
  addFollow,
  getUsersFromIdArr,
  userJoiningTeam,
  userLeavingTeam,
  removeFollow,
} from "../../utils/api";
// Context
import { useStoreState } from "../../store";
import { Team, User } from "../../utils/interfaces";
// Components
import MembersModal from "./MembersModal";

interface Props {
  team: Team;
  setTeam: React.Dispatch<React.SetStateAction<Team | null>>;
  teamMembers: User[] | null;
  setTeamMembers: React.Dispatch<React.SetStateAction<User[] | null>>;
}

const TopTile: React.FC<Props> = ({ team, setTeam, teamMembers, setTeamMembers }) => {
  const { user } = useStoreState();

  const [showMembers, setShowMembers] = useState(false);
  const [userFollowing, setUserFollowing] = useState<string[]>([]);

  const userIsInTeam = () => team.members.includes(user!._id);

  const handleJoinTeam = async (team_id: string) => {
    const joined = await userJoiningTeam(user!._id, team_id);

    if (joined) setTeam((prev) => prev && { ...prev, members: [...prev?.members, user!._id] });
  };

  const handleLeaveTeam = async (team_id: string) => {
    const left = await userLeavingTeam(user!._id, team_id);

    if (left) {
      setTeam(
        (prev) =>
          prev && {
            ...prev,
            members: [...prev.members.filter((_id) => _id !== user!._id)],
          }
      );
    }
  };

  const handleFollowClick = async (member_id: string) => {
    const followed = await addFollow(user!._id, member_id);
    if (followed) setUserFollowing((prev) => [...prev, member_id]);
  };

  const handleUnfollowClick = async (member_id: string) => {
    const unfollowed = await removeFollow(user!._id, member_id);
    if (unfollowed) setUserFollowing((prev) => [...prev.filter((_id) => _id !== member_id)]);
  };

  useEffect(() => {
    const getTeamMembers = async () => {
      const members = await getUsersFromIdArr(team.members);
      if (members) setTeamMembers(members);
    };

    if (showMembers && !teamMembers) getTeamMembers();
  }, [showMembers]);

  useEffect(() => {
    if (user) setUserFollowing(user.following || []);
  }, [user]);

  return (
    <Tile>
      <h1>{team.teamName}</h1>

      <div className="info">
        <p>
          Leader -{" "}
          <Link href={`/users/${team.creatorName}`}>
            <a className="leader">{team.creatorName}</a>
          </Link>
        </p>

        <p>•</p>

        <p className="membersCount" onClick={() => setShowMembers(true)}>
          {team.members.length} {team.members.length === 1 ? "member" : "members"}
        </p>
        <button
          onClick={
            userIsInTeam() ? () => handleLeaveTeam(team._id) : () => handleJoinTeam(team._id)
          }
          className={userIsInTeam() ? "joined" : "join"}
        >
          {userIsInTeam() ? "Joined" : "Join"}
        </button>
      </div>

      {showMembers && (
        <MembersModal
          setShowMembers={setShowMembers}
          showMembers={showMembers}
          teamMembers={teamMembers}
          userFollowing={userFollowing}
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

  h1 {
    margin-bottom: 0.5rem;
    font-weight: 300;
    font-size: 2rem;
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
      box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
      margin-left: auto;

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
