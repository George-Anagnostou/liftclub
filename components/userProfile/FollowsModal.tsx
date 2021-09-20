import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Context
import { useStoreDispatch, useStoreState } from "../../store";
import { addUserFollow, removeUserFollow } from "../../store/actions/userActions";
import { getUsersFromIdArr } from "../../utils/api";
// Interfaces
import { ShortUser } from "../../utils/interfaces";
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
  const dispatch = useStoreDispatch();

  const [members, setMembers] = useState<ShortUser[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFollowClick = (mem_id: string) => {
    addUserFollow(dispatch, user!._id, mem_id);
  };

  const handleUnfollowClick = (mem_id: string) => {
    removeUserFollow(dispatch, user!._id, mem_id);
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

                {user?.following?.includes(member._id) ? (
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
        transition: all 0.2s ease;
        font-size: 0.7rem;

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
