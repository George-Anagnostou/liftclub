import React from "react";
import styled from "styled-components";
import { useBuilderDispatch } from "../../../store";
import { deleteTeamFromCreatedTeams } from "../../../store/actions/builderActions";
// Interface
import { Team } from "../../../types/interfaces";
// Components
import Modal from "../../Wrappers/Modal";

interface Props {
  team: Team;
  setTeamToDelete: React.Dispatch<React.SetStateAction<Team | null>>;
  clearTeam: () => void;
}

const DeleteTeamModal: React.FC<Props> = ({ team, setTeamToDelete, clearTeam }) => {
  const builderDispatch = useBuilderDispatch();

  const handleDeleteRoutine = async () => {
    const deleted = await deleteTeamFromCreatedTeams(builderDispatch, team._id);

    if (deleted) {
      setTeamToDelete(null);
      clearTeam();
    }
  };

  return (
    <Modal isOpen={Boolean(team)} removeModal={() => setTeamToDelete(null)}>
      <Container>
        <button className="close-btn" onClick={() => setTeamToDelete(null)}>
          ✕
        </button>

        <h3>
          Are you sure you want to delete <span>{team.teamName}</span>?
        </h3>

        <div>
          <button onClick={handleDeleteRoutine}>Yes</button>
          <button onClick={() => setTeamToDelete(null)}>Cancel</button>
        </div>
      </Container>
    </Modal>
  );
};

export default DeleteTeamModal;

const Container = styled.div`
  position: relative;
  width: 95%;
  margin: 10vh auto;
  max-width: 350px;
  background: ${({ theme }) => theme.buttonLight};
  box-shadow: 0 0 10px ${({ theme }) => theme.boxShadow};
  border-radius: 5px;
  padding: 1.5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;

  .close-btn {
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.textLight};
    border: none;
    border-radius: 3px;
    position: absolute;
    top: 2px;
    right: 2px;
    height: 25px;
    width: 25px;
  }

  h3 {
    text-align: center;
    font-weight: 200;
  }

  h3 span {
    text-transform: capitalize;
    font-weight: 600;
  }

  div {
    button {
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 1px 2px ${({ theme }) => theme.boxShadow};
      color: inherit;
      border: none;
      border-radius: 5px;
      margin: 1rem 2rem 0;
      padding: 0.5rem 1rem;
      font-size: 1.1rem;
    }
  }
`;
