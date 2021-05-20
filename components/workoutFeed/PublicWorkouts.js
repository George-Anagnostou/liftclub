import { useEffect, useState } from "react";
import styled from "styled-components";

import PublicWorkoutTile from "./PublicWorkoutTile";
import SearchBar from "./SearchBar";

export default function PublicWorkouts({
  workouts,
  workoutIsSaved,
  removeFromSavedWorkouts,
  addToSavedWorkouts,
}) {
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);

  return (
    <WorkoutList>
      <SearchBar workouts={workouts} setFilteredWorkouts={setFilteredWorkouts} />

      <h3 className="listTitle">Public Workouts</h3>

      {filteredWorkouts.map((workout) => (
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

  .listTitle {
    margin-left: 1.5rem;
    text-align: left;
    color: #ccc;
    font-weight: 400;
  }
`;
