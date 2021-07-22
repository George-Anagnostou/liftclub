import React, { ReactElement } from "react";
import styled from "styled-components";
// Components
import Modal from "../Wrappers/Modal";
import LoadingSpinner from "../LoadingSpinner";
import { Team, User } from "../../utils/interfaces";

interface Props {
  setShowTrainerModal: React.Dispatch<React.SetStateAction<boolean>>;
  showTrainerModal: boolean;
  teamMembers: User[] | null;
  team: Team;
  handleRemoveTrainer: (trainer: User) => Promise<void>;
  handleAddTrainer: (trainer: User) => Promise<void>;
}

const TrainerModal: React.FC<Props> = ({
  setShowTrainerModal,
  showTrainerModal,
  teamMembers,
  team,
  handleRemoveTrainer,
  handleAddTrainer,
}) => {
  return (
    <Modal removeModal={() => setShowTrainerModal(false)} isOpen={showTrainerModal}>
      <TrainerManager>
        <h3 className="title">Members</h3>

        {teamMembers ? (
          <ul>
            {teamMembers.map((member) => (
              <li key={member._id}>
                <p>{member.username}</p>

                {team.trainers.findIndex((trainer) => trainer._id === member._id) >= 0 ? (
                  <button className="remove" onClick={() => handleRemoveTrainer(member)}>
                    remove
                  </button>
                ) : (
                  <button className="add" onClick={() => handleAddTrainer(member)}>
                    add
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <LoadingSpinner />
        )}
      </TrainerManager>
    </Modal>
  );
};
export default TrainerModal;

const TrainerManager = styled.div`
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

      button {
        min-width: max-content;
        cursor: pointer;
        border-radius: 5px;
        border: none;
        padding: 0.25rem;
        box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};

        &.add {
          background: ${({ theme }) => theme.accentSoft};
          color: ${({ theme }) => theme.accentText};
        }

        &.remove {
          background: ${({ theme }) => theme.buttonLight};
          color: ${({ theme }) => theme.textLight};
        }
      }
    }
  }
`;
