import styled from "styled-components";
import { deleteWorkout } from "../../utils/ApiSupply";

export default function DeleteWorkoutModul({ workout, setWorkoutToDelete, clearCustomWorkout }) {
  const handleDeleteWorkout = async () => {
    const deleted = await deleteWorkout(workout._id);

    if (deleted) {
      setWorkoutToDelete(null);
      clearCustomWorkout();
    }
  };

  const handleModulShadowClick = (e) => {
    // Only close the modul when the shadow is clicked
    if (e.target.classList.contains("modul-shadow")) setWorkoutToDelete(null);
  };

  return (
    <ModulContainer className="modul-shadow" onClick={handleModulShadowClick}>
      <div className="modul">
        <button className="close-btn" onClick={() => setWorkoutToDelete(null)}>
          X
        </button>

        <h3>Are you sure you want to delete {workout.name}?</h3>

        <div>
          <button onClick={handleDeleteWorkout}>I'm sure</button>
          <button onClick={() => setWorkoutToDelete(null)}>Cancel</button>
        </div>
      </div>
    </ModulContainer>
  );
}

const ModulContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.2);

  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;

  display: grid;
  place-items: center;

  .modul {
    position: relative;
    height: 20%;
    width: 95%;
    max-width: 350px;
    background: white;
    border-radius: 5px;
    box-shadow: 0 0 5px grey;

    display: flex;
    flex-direction: column;
    justify-content: center;

    .close-btn {
      position: absolute;
      top: 2px;
      right: 2px;
      height: 15px;
      width: 15px;
      font-size: 10px;
    }

    div {
      button {
        margin: 0.5rem 1rem;
      }
    }
  }
`;
