import React, { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";
// Components
import LoadingSpinner from "../LoadingSpinner";
import Modal from "../Wrappers/Modal";
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

export default function TopTile({ team, setTeam, teamMembers, setTeamMembers }) {
  const { user } = useStoreState();

  const [showMembers, setShowMembers] = useState(false);
  const [userFollowing, setUserFollowing] = useState([]);

  const userIsInTeam = () => team.members.includes(user._id);

  const handleJoinTeam = async (team_id) => {
    const joined = await userJoiningTeam(user._id, team_id);

    if (joined) {
      setTeam((prev) => {
        prev.members = [...prev.members, user._id];
        return { ...prev };
      });
    }
  };

  const handleLeaveTeam = async (team_id) => {
    const left = await userLeavingTeam(user._id, team_id);

    if (left) {
      setTeam((prev) => {
        prev.members = [...prev.members.filter((_id) => _id !== user._id)];
        return { ...prev };
      });
    }
  };

  const handleFollowClick = async (member_id) => {
    const followed = await addFollow(user._id, member_id);
    if (followed) setUserFollowing((prev) => [...prev, member_id]);
  };

  const handleUnfollowClick = async (member_id) => {
    const unfollowed = await removeFollow(user._id, member_id);
    if (unfollowed) setUserFollowing((prev) => [...prev.filter((_id) => _id !== member_id)]);
  };

  useEffect(() => {
    const getTeamMembers = async () => {
      const members = await getUsersFromIdArr(team.members);
      setTeamMembers(members);
    };

    if (showMembers && !teamMembers) getTeamMembers();
  }, [showMembers]);

  useEffect(() => {
    if (user) setUserFollowing(user.following);
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
        <Modal removeModal={() => setShowMembers(false)} isOpen={showMembers}>
          <MembersList>
            <h3 className="title">Members</h3>

            {teamMembers ? (
              <ul>
                {teamMembers.map((member) => (
                  <li key={member._id}>
                    <Link href={`/users/${member.username}`}>
                      <p>{member.username}</p>
                    </Link>

                    {userFollowing.includes(member._id) ? (
                      <button className="following" onClick={() => handleUnfollowClick(member._id)}>
                        following
                      </button>
                    ) : (
                      user._id !== member._id && (
                        <button className="follow" onClick={() => handleFollowClick(member._id)}>
                          follow
                        </button>
                      )
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <LoadingSpinner />
            )}
          </MembersList>
        </Modal>
      )}
    </Tile>
  );
}

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

const MembersList = styled.div`
  margin: 1rem auto 0;
  padding: 0.5rem;
  border-radius: 10px;
  background: ${({ theme }) => theme.background};
  max-width: 400px;
  width: 95%;
  position: relative;

  ul {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 0.5rem;
      margin-bottom: 0.5rem;
      border-radius: 5px;
      background: ${({ theme }) => theme.buttonMed};

      p {
        flex: 1;
        text-align: left;
      }

      button {
        min-width: max-content;
        cursor: pointer;
        border-radius: 5px;
        border: none;
        padding: 0.25rem;
        box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};

        &.follow {
          background: ${({ theme }) => theme.accentSoft};
          color: ${({ theme }) => theme.accentText};
        }

        &.following {
          background: ${({ theme }) => theme.buttonLight};
          color: ${({ theme }) => theme.textLight};
        }
      }
    }
  }
`;
