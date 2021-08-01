import Link from "next/link";
import React from "react";
import styled from "styled-components";
// Context
import { useStoreState } from "../../store";
// Interfaces
import { User } from "../../utils/interfaces";
// Components
import LoadingSpinner from "../LoadingSpinner";
import Modal from "../Wrappers/Modal";

interface Props {
  setShowMembers: React.Dispatch<React.SetStateAction<boolean>>;
  showMembers: boolean;
  teamMembers: User[] | null;
  handleUnfollowClick: (member_id: string) => void;
  handleFollowClick: (member_id: string) => void;
}

const MembersModal: React.FC<Props> = ({
  setShowMembers,
  showMembers,
  teamMembers,
  handleUnfollowClick,
  handleFollowClick,
}) => {
  const { user } = useStoreState();

  return (
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
          <LoadingSpinner />
        )}
      </MembersList>
    </Modal>
  );
};

export default MembersModal;

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
