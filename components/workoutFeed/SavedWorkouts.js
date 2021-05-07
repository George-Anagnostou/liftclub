import { useState } from "react";
import styled from "styled-components";
// Components
import SavedWorkoutTile from "./SavedWorkoutTile";

export default function SavedWorkouts({ workouts, removeFromSavedWorkouts }) {
  const [showSavedWorkouts, setShowSavedWorkouts] = useState(false);

  const toggleShow = () => {
    setShowSavedWorkouts((prev) => !prev);
  };

  return (
    <WorkoutList style={showSavedWorkouts ? { top: "10%" } : null}>
      <div className="list-heading">
        <h3>Saved Workouts</h3>
        <button
          className="toggle-btn"
          onClick={toggleShow}
          style={showSavedWorkouts ? { transform: "rotate(180deg)" } : null}
        >
          ^
        </button>
      </div>

      <div className="tile-container">
        {workouts.map((workout, i) => (
          <SavedWorkoutTile
            key={`saved ${workout._id}`}
            workout={workout}
            removeFromSavedWorkouts={removeFromSavedWorkouts}
          />
        ))}
      </div>
    </WorkoutList>
  );
}

const WorkoutList = styled.ul`
  width: 50%;
  height: 91%;
  position: fixed;
  top: calc(100% - 60px);
  background: #f8f8f8;
  border: 1px solid #adadad;

  border-radius: 10px 10px 0 0;
  transition: all 0.3s ease-in-out;

  .list-heading {
    height: 60px;
    box-shadow: 0 2px 5px grey;
    position: relative;
    z-index: 99;

    display: flex;
    align-items: center;
    justify-content: center;

    h3 {
      font-size: 1.5rem;
    }

    .toggle-btn {
      position: absolute;
      top: 10px;
      right: 2rem;
      background: #eaeeff;
      box-shadow: 0 0 5px grey;
      border-radius: 50%;
      border: none;
      width: 40px;
      height: 40px;

      font-weight: bold;
      font-size: 1.5rem;
      padding-top: 7px;
    }
  }

  .tile-container {
    height: calc(100% - 67px);
    overflow: scroll;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
