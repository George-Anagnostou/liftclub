import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import SavedWorkouts from "../components/feed/SavedWorkouts";
import PublicWorkouts from "../components/feed/PublicWorkouts";
// Utils
import { getPublicWorkouts, getWorkoutsFromIdArray } from "../utils/api";
// Context
import { useStoreDispatch, useStoreState } from "../store";
import { addSavedWorkout, removeSavedWorkout } from "../store/actions/userActions";
// Interfaces
import { Workout } from "../utils/interfaces";

export default function feed() {
  const { user, isSignedIn } = useStoreState();
  const dispatch = useStoreDispatch();

  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [publicWorkouts, setPublicWorkouts] = useState<Workout[]>([]);

  const addToSavedWorkouts = (workout: Workout) => {
    addSavedWorkout(dispatch, user!._id, workout._id);
  };

  const removeFromSavedWorkouts = (workout: Workout) => {
    removeSavedWorkout(dispatch, user!._id, workout._id);
  };

  useEffect(() => {
    const getSavedWorkouts = async () => {
      const workouts = await getWorkoutsFromIdArray(user!.savedWorkouts!);
      setSavedWorkouts(workouts.reverse());
    };

    const getAllPublicWorkouts = async () => {
      const workouts = await getPublicWorkouts();
      setPublicWorkouts(workouts);
    };

    if (isSignedIn) {
      // Get all public workouts
      getAllPublicWorkouts();
      // Get all workotus saved by the user
      getSavedWorkouts();
    }
  }, [isSignedIn]);

  return (
    <WorkoutFeedContainer>
      <PublicWorkouts
        workouts={publicWorkouts}
        removeFromSavedWorkouts={removeFromSavedWorkouts}
        addToSavedWorkouts={addToSavedWorkouts}
      />

      <SavedWorkouts workouts={savedWorkouts} removeFromSavedWorkouts={removeFromSavedWorkouts} />
    </WorkoutFeedContainer>
  );
}

const WorkoutFeedContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  margin-top: 55px;
`;
