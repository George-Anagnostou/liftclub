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
  removeFromSavedWorkouts: (workout: Workout) => void;
  addToSavedWorkouts: (workout: Workout) => void;
}

const PublicWorkouts: React.FC<Props> = ({
  workouts,
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

      <h3 className="list-title">Public Workouts</h3>

      {loading ? (
        <LoadingSpinner />
      ) : Boolean(filteredWorkouts.length) ? (
        filteredWorkouts.map((workout) => (
          <PublicWorkoutTile
            key={`public${workout._id}`}
            workout={workout}
            removeFromSavedWorkouts={removeFromSavedWorkouts}
            addToSavedWorkouts={addToSavedWorkouts}
          />
        ))
      ) : (
        <h3 className="fallback-text">Nothing here</h3>
      )}
    </WorkoutList>
  );
};
export default PublicWorkouts;

const WorkoutList = styled.ul`
  width: 100%;
  flex: 1;

  .list-title {
    margin-left: 1.5rem;
    text-align: left;
    color: ${({ theme }) => theme.textLight};
    font-weight: 400;
  }

  .fallback-text {
    text-align: center;
    color: ${({ theme }) => theme.textLight};
    font-weight: 400;
  }
`;
