import React from "react";
import styled from "styled-components";
// Components
import Modal from "../Wrappers/Modal";
import LoadingSpinner from "../LoadingSpinner";
import { Team, User, ShortUser } from "../../utils/interfaces";

interface Props {
  setShowTrainerModal: React.Dispatch<React.SetStateAction<boolean>>;
  showTrainerModal: boolean;
  teamMembers: ShortUser[] | null;
  team: Team;
  handleRemoveTrainer: (trainer: ShortUser) => Promise<void>;
  handleAddTrainer: (trainer: ShortUser) => Promise<void>;
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
                  <button onClick={() => handleRemoveTrainer(member)}>remove</button>
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
    max-height: 70vh;
    overflow-y: scroll;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 0.25rem 0.5rem;
      margin-bottom: 0.25rem;
      border-radius: 5px;
      background: ${({ theme }) => theme.buttonMed};

      button {
        font-size: 0.6rem;
        font-weight: 300;
        background: ${({ theme }) => theme.buttonLight};
        color: ${({ theme }) => theme.textLight};
        border: none;
        border-radius: 3px;
        margin-left: 0.3rem;
        padding: 0.1rem 0.25rem;
        transition: all 0.25s ease;

        &.add {
          background: ${({ theme }) => theme.accentSoft};
          color: ${({ theme }) => theme.accentText};
        }
      }
    }
  }
`;
