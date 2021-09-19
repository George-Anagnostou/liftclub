import styled from "styled-components";
// Components
import PublicWorkoutTile from "./PublicWorkoutTile";
// Interfaces
import { Workout } from "../../utils/interfaces";
import LoadingSpinner from "../LoadingSpinner";
// API
import { addSavedWorkout, removeSavedWorkout } from "../../store/actions/userActions";
import { useStoreDispatch, useStoreState } from "../../store";

interface Props {
  workouts: Workout[];
}

const PublicWorkouts: React.FC<Props> = ({ workouts }) => {
  const { user } = useStoreState();
  const dispatch = useStoreDispatch();

  const addToSavedWorkouts = (workout: Workout) => {
    addSavedWorkout(dispatch, user!._id, workout._id);
  };

  const removeFromSavedWorkouts = (workout: Workout) => {
    removeSavedWorkout(dispatch, user!._id, workout._id);
  };

  return (
    <WorkoutList>
      {Boolean(workouts.length) ? (
        workouts.map((workout) => (
          <PublicWorkoutTile
            key={`public${workout._id}`}
            workout={workout}
            removeFromSavedWorkouts={removeFromSavedWorkouts}
            addToSavedWorkouts={addToSavedWorkouts}
          />
        ))
      ) : (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      )}
    </WorkoutList>
  );
};
export default PublicWorkouts;

const WorkoutList = styled.ul`
  width: 100%;
  flex: 1;

  .loading-container {
    display: grid;
    place-items: center;
    height: 70vh;
  }
`;
