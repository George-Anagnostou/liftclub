import styled from "styled-components";
import SavedWorkoutTile from "./SavedWorkoutTile";

export default function SavedWorkouts({ workouts, removeFromSavedWorkouts }) {
  return (
    <WorkoutList>
      <h3>Saved Workouts</h3>

      {workouts.map((workout, i) => (
        <SavedWorkoutTile
          key={`saved ${workout._id}`}
          workout={workout}
          removeFromSavedWorkouts={removeFromSavedWorkouts}
        />
      ))}
    </WorkoutList>
  );
}

const WorkoutList = styled.ul`
  width: 50%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;
