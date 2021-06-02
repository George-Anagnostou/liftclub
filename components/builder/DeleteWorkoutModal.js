import styled from "styled-components";
import { deleteWorkout } from "../../utils/api";

export default function DeleteWorkoutModal({ workout, setWorkoutToDelete, clearCustomWorkout }) {
  const handleDeleteWorkout = async () => {
    const deleted = await deleteWorkout(workout._id);

    if (deleted) {
      setWorkoutToDelete(null);
      clearCustomWorkout();
    }
  };

  const handleModalShadowClick = (e) => {
    // Only close the modal when the shadow is clicked
    if (e.target.classList.contains("modal-shadow")) setWorkoutToDelete(null);
  };

  return (
    <ModalContainer className="modal-shadow" onClick={handleModalShadowClick}>
      <div className="modal">
        <button className="close-btn" onClick={() => setWorkoutToDelete(null)}>
          X
        </button>

        <h3>
          Are you sure you want to delete <span>{workout.name}</span>?
        </h3>

        <div>
          <button onClick={handleDeleteWorkout}>Yes</button>
          <button onClick={() => setWorkoutToDelete(null)}>Cancel</button>
        </div>
      </div>
    </ModalContainer>
  );
}

const ModalContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);

  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;

  display: grid;
  place-items: center;

  .modal {
    position: relative;
    height: 20%;
    width: 95%;
    max-width: 350px;
    background: ${({ theme }) => theme.buttonLight};
    border: 3px solid ${({ theme }) => theme.accentSoft};
    box-shadow: 0 0 10px ${({ theme }) => theme.boxShadow};
    border-radius: 5px;
    padding: 0 1.5rem;

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

    h3 span {
      text-transform: capitalize;
    }

    div {
      button {
        background: ${({ theme }) => theme.buttonLight};
        box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};
        color: inherit;
        border: none;
        border-radius: 3px;
        margin: 1rem 2rem;
        padding: 0.5rem 1rem;
        font-size: 1.1rem;
      }
    }
  }
`;
