import React from "react";
import styled from "styled-components";
// API
import { deleteRoutine } from "../../../utils/api";
// Interfaces
import { Routine } from "../../../utils/interfaces";
// Components
import Modal from "../../Wrappers/Modal";

interface Props {
  routine: Routine;
  setRoutineToDelete: React.Dispatch<React.SetStateAction<Routine | null>>;
  clearRoutine: () => void;
  setUserRoutines: React.Dispatch<React.SetStateAction<Routine[] | null>>;
}

const DeleteRoutineModal: React.FC<Props> = ({
  routine,
  setRoutineToDelete,
  clearRoutine,
  setUserRoutines,
}) => {
  const handleDeleteRoutine = async () => {
    const deleted = await deleteRoutine(routine._id);

    if (deleted) {
      setUserRoutines((prev) => prev && prev.filter((each) => each._id !== routine._id));
      setRoutineToDelete(null);
      clearRoutine();
    }
  };

  return (
    <Modal isOpen={Boolean(routine)} removeModal={() => setRoutineToDelete(null)}>
      <Container>
        <button className="close-btn" onClick={() => setRoutineToDelete(null)}>
          X
        </button>

        <h3>
          Are you sure you want to delete <span>{routine.name}</span>?
        </h3>

        <div>
          <button onClick={handleDeleteRoutine}>Yes</button>
          <button onClick={() => setRoutineToDelete(null)}>Cancel</button>
        </div>
      </Container>
    </Modal>
  );
};

export default DeleteRoutineModal;

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
    height: 15px;
    width: 15px;
    font-size: 10px;
  }

  h3 {
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
