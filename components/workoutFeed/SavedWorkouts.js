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
    <WorkoutList style={showSavedWorkouts ? { top: "0%" } : null}>
      <div className="tile-container">
        {!Boolean(workouts.length) && (
          <>
            <h3 className="tip">You haven't saved any workouts yet.</h3>
            <p className="tip"> Tip: Try pressing the + button on a workout to save it.</p>
          </>
        )}

        {workouts.map((workout, i) => (
          <SavedWorkoutTile
            key={`saved ${workout._id}`}
            workout={workout}
            removeFromSavedWorkouts={removeFromSavedWorkouts}
          />
        ))}
      </div>

      <div className="list-heading" onClick={toggleShow}>
        <h3>Saved Workouts</h3>
        <button className="toggle-btn">
          <p style={showSavedWorkouts ? { transform: "rotate(0deg)" } : null}>^</p>
        </button>
      </div>
    </WorkoutList>
  );
}

const WorkoutList = styled.ul`
  width: 100%;
  height: 85%;
  position: fixed;
  top: calc(-85% + 50px);
  background: #f8f8f8;
  box-shadow: 0 5px 5px #ccc;

  border-radius: 0px 0px 10px 10px;
  overflow: hidden;
  transition: all 0.3s ease-in-out;

  .tile-container {
    height: calc(100% - 50px);
    overflow: scroll;

    .tip {
      margin: 1rem;
    }
  }

  .list-heading {
    height: 50px;
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
      top: 8px;
      right: 2rem;
      background: #eaeeff;
      box-shadow: 0 2px 5px grey;
      border-radius: 50%;
      border: none;
      width: 35px;
      height: 35px;

      font-weight: bold;
      font-size: 1.5rem;

      p {
        transform: rotate(180deg);
        width: 35px;
        height: 19px;
      }
    }
  }
`;
