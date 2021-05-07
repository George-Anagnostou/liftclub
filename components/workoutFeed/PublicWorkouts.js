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
  margin-bottom: 70px;

  h3 {
    margin-top: 0.5rem;
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
