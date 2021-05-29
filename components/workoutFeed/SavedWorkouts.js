import { useState } from "react";
import styled from "styled-components";
import SwipeBox from "../hooks/SwipeBox";
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
        {!Boolean(workouts.length) && <h3 className="tip">You haven't saved any workouts yet.</h3>}

        {workouts.map((workout) => (
          <SavedWorkoutTile
            key={`saved ${workout._id}`}
            workout={workout}
            removeFromSavedWorkouts={removeFromSavedWorkouts}
          />
        ))}
      </div>

      <SwipeBox toggler={toggleShow} targetDirection={["down", "up"]}>
        <div className="list-heading" onClick={toggleShow}>
          <h3>Saved Workouts</h3>
          <button className="toggle-btn">
            <p style={showSavedWorkouts ? { transform: "rotate(0deg)" } : null}>^</p>
          </button>
        </div>
      </SwipeBox>
    </WorkoutList>
  );
}

const WorkoutList = styled.ul`
  width: 100%;
  height: 85%;
  position: fixed;
  top: calc(-85% + 50px);
  background: ${({ theme }) => theme.body};
  box-shadow: 0 5px 5px ${({ theme }) => theme.boxShadow};

  border-radius: 0px 0px 10px 10px;
  overflow: hidden;
  transition: all 0.3s ease-in-out;

  .tile-container {
    height: calc(100% - 50px);
    overflow-x: hidden;
    overflow-y: scroll;

    .tip {
      margin: 50% 1rem 0;
      font-weight: 300;
      color: ${({ theme }) => theme.textLight};
    }
  }

  .list-heading {
    height: 50px;
    box-shadow: 0 -2px 5px ${({ theme }) => theme.boxShadow};
    color: ${({ theme }) => theme.textLight};
    position: relative;
    z-index: 99;

    display: flex;
    align-items: center;
    justify-content: center;

    h3 {
      font-size: 1.5rem;
      font-weight: 300;
    }

    .toggle-btn {
      position: absolute;
      top: 8px;
      right: 2rem;
      background: ${({ theme }) => theme.buttonLight};
      color: ${({ theme }) => theme.textLight};
      border: none;
      border-radius: 50%;
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
