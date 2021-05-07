import styled from "styled-components";

import PublicWorkoutTile from "./PublicWorkoutTile";

export default function PublicWorkouts({
  workouts,
  workoutIsSaved,
  removeFromSavedWorkouts,
  addToSavedWorkouts,
}) {
  return (
    <WorkoutList>
      <h3>Public Workouts</h3>

      {workouts.map((workout) => (
        <PublicWorkoutTile
          key={`public${workout._id}`}
          workout={workout}
          workoutIsSaved={workoutIsSaved}
          removeFromSavedWorkouts={removeFromSavedWorkouts}
          addToSavedWorkouts={addToSavedWorkouts}
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
