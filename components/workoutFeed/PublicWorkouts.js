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
      <p>Tip: Want to try out a workout? Click the + icon to add it to your saved workouts.</p>

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
  width: 100%;

  p {
    margin-top: 0.5rem;
  }
`;
