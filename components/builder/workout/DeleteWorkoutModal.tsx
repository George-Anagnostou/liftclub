import styled from "styled-components";
// Components
import Modal from "../../Wrappers/Modal";
// Context
import { deleteWorkoutFromCreatedWorkouts } from "../../../store/actions/builderActions";
import { useBuilderDispatch } from "../../../store";
// Interfaces
import { Workout } from "../../../types/interfaces";

interface Props {
  workout: Workout;
  setWorkoutToDelete: React.Dispatch<React.SetStateAction<Workout | null>>;
  clearCustomWorkout: () => void;
}

const DeleteWorkoutModal: React.FC<Props> = ({
  workout,
  setWorkoutToDelete,
  clearCustomWorkout,
}) => {
  const dispatch = useBuilderDispatch();

  const handleDeleteWorkout = async () => {
    const deleted = await deleteWorkoutFromCreatedWorkouts(dispatch, workout._id);

    if (deleted) {
      setWorkoutToDelete(null);
      clearCustomWorkout();
    }
  };

  return (
    <Modal isOpen={Boolean(workout)} removeModal={() => setWorkoutToDelete(null)}>
      <Container>
        <button className="close-btn" onClick={() => setWorkoutToDelete(null)}>
          ✕
        </button>

        <h3>
          Are you sure you want to delete <span>{workout.name}</span>?
        </h3>

        <div>
          <button onClick={handleDeleteWorkout}>Yes</button>
          <button onClick={() => setWorkoutToDelete(null)}>Cancel</button>
        </div>
      </Container>
    </Modal>
  );
};
export default DeleteWorkoutModal;

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
