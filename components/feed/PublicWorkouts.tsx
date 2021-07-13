import { useState } from "react";
import styled from "styled-components";
// Components
import PublicWorkoutTile from "./PublicWorkoutTile";
import SearchBar from "./SearchBar";
import LoadingSpinner from "../LoadingSpinner";
// Interfaces
import { Workout } from "../../utils/interfaces";

interface Props {
  workouts: Workout[];
  workoutIsSaved: (workout: Workout) => boolean;
  removeFromSavedWorkouts: (workout: Workout) => Promise<void>;
  addToSavedWorkouts: (workout: Workout) => Promise<void>;
}

const PublicWorkouts: React.FC<Props> = ({
  workouts,
  workoutIsSaved,
  removeFromSavedWorkouts,
  addToSavedWorkouts,
}) => {
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <WorkoutList>
      <SearchBar
        workouts={workouts}
        setFilteredWorkouts={setFilteredWorkouts}
        setLoading={setLoading}
      />

      <h3 className="listTitle">Public Workouts</h3>

      {loading ? (
        <LoadingSpinner />
      ) : (
        filteredWorkouts.map((workout) => (
          <PublicWorkoutTile
            key={`public${workout._id}`}
            workout={workout}
            workoutIsSaved={workoutIsSaved}
            removeFromSavedWorkouts={removeFromSavedWorkouts}
            addToSavedWorkouts={addToSavedWorkouts}
          />
        ))
      )}
    </WorkoutList>
  );
};
export default PublicWorkouts;

const WorkoutList = styled.ul`
  width: 100%;

  .listTitle {
    margin-left: 1.5rem;
    text-align: left;
    color: ${({ theme }) => theme.textLight};
    font-weight: 400;
  }
`;