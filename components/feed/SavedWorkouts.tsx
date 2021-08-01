import { useRef, useState } from "react";
import styled from "styled-components";
// Hooks
import useTouchSwipe from "../hooks/useTouchSwipe";
// Components
import SavedWorkoutTile from "./SavedWorkoutTile";
// Interfaces
import { Workout } from "../../utils/interfaces";

interface Props {
  workouts: Workout[];
  removeFromSavedWorkouts: (workout: Workout) => void;
}

const SavedWorkouts: React.FC<Props> = ({ workouts, removeFromSavedWorkouts }) => {
  const swipeRef = useRef<HTMLDivElement>(null);

  const [showDrawer, setShowDrawer] = useState(false);

  const toggleShow = () => setShowDrawer((prev) => !prev);

  useTouchSwipe(swipeRef, ["down", "up"], () => toggleShow());

  return (
    <WorkoutList style={showDrawer ? { top: "0%" } : {}}>
      <div className="drawer">
        {!Boolean(workouts.length) && <h3 className="tip">You don't have any saved workouts.</h3>}

        {workouts.map((workout) => (
          <SavedWorkoutTile
            key={`saved ${workout._id}`}
            workout={workout}
            removeFromSavedWorkouts={removeFromSavedWorkouts}
          />
        ))}
      </div>

      <div ref={swipeRef} className="list-heading" onClick={toggleShow}>
        <h3>Saved Workouts</h3>
        <span className="drawer-indicator"></span>
      </div>
    </WorkoutList>
  );
};
export default SavedWorkouts;

const WorkoutList = styled.ul`
  width: 98%;
  height: 85%;
  position: fixed;
  top: calc(-85% + 40px);
  left: 1%;
  background: ${({ theme }) => theme.body};
  box-shadow: 0 5px 5px ${({ theme }) => theme.boxShadow};

  border-radius: 0px 0px 10px 10px;
  overflow: hidden;
  transition: all 0.35s ease-out;

  .drawer {
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
    background: ${({ theme }) => theme.background};
    box-shadow: 0 -2px 5px ${({ theme }) => theme.boxShadow};
    color: ${({ theme }) => theme.textLight};
    position: relative;
    z-index: 99;

    display: flex;
    align-items: center;
    justify-content: center;

    h3 {
      line-height: 1rem;
      font-size: 1.1rem;
      font-weight: 300;
    }

    .drawer-indicator {
      position: absolute;
      bottom: 5px;
      background: ${({ theme }) => theme.border};
      border-radius: 5px;
      width: 100px;
      height: 5px;
    }
  }
`;
