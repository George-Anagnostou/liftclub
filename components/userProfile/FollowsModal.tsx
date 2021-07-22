import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Context
import { useStoreState } from "../../store";
import { addFollow, getUsersFromIdArr, removeFollow } from "../../utils/api";
// Interfaces
import { User } from "../../utils/interfaces";
// Components
import LoadingSpinner from "../LoadingSpinner";
import Modal from "../Wrappers/Modal";

interface Props {
  member_ids: string[];
  setShowFollowsModal: React.Dispatch<React.SetStateAction<boolean>>;
  showFollowsModal: boolean;
}

const FollowsModal: React.FC<Props> = ({ member_ids, setShowFollowsModal, showFollowsModal }) => {
  const { user } = useStoreState();

  const [members, setMembers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [userFollowing, setUserFollowing] = useState<string[]>([]);

  const handleFollowClick = async (mem_id: string) => {
    const followed = await addFollow(user!._id, mem_id);
    if (followed) setUserFollowing((prev) => [...prev, mem_id]);
  };

  const handleUnfollowClick = async (mem_id: string) => {
    const unfollowed = await removeFollow(user!._id, mem_id);
    if (unfollowed) setUserFollowing((prev) => [...prev.filter((_id) => _id !== mem_id)]);
  };

  useEffect(() => {
    const getMembers = async () => {
      setLoading(true);

      const mems = await getUsersFromIdArr(member_ids);

      if (mems) setMembers(mems);

      setLoading(false);
    };

    if (member_ids.length) getMembers();
  }, [member_ids]);

  useEffect(() => {
    if (user) setUserFollowing(user.following || []);
  }, [user]);

  console.log(userFollowing);

  return (
    <Modal removeModal={() => setShowFollowsModal(false)} isOpen={showFollowsModal}>
      <MembersList>
        <h3 className="title">Members</h3>

        {loading && <LoadingSpinner />}

        {Boolean(member_ids.length) ? (
          <ul>
            {members?.map((member) => (
              <li key={member._id}>
                <Link href={`/users/${member.username}`}>
                  <p onClick={() => setShowFollowsModal(false)}>{member.username}</p>
                </Link>

                {userFollowing.includes(member._id) ? (
                  <button className="following" onClick={() => handleUnfollowClick(member._id)}>
                    following
                  </button>
                ) : (
                  user!._id !== member._id && (
                    <button className="follow" onClick={() => handleFollowClick(member._id)}>
                      follow
                    </button>
                  )
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            <li>None</li>
          </ul>
        )}
      </MembersList>
    </Modal>
  );
};

export default FollowsModal;

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
