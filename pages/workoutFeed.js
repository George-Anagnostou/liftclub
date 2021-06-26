import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import SavedWorkouts from "../components/workoutFeed/SavedWorkouts";
import PublicWorkouts from "../components/workoutFeed/PublicWorkouts";
// Utils
import {
  addUserSavedWorkout,
  getPublicWorkouts,
  getWorkoutsFromIdArray,
  removeUserSavedWorkout,
} from "../utils/api";
// Context
import { useStoreState } from "../store";

export default function workoutFeed() {
  const { user } = useStoreState();

  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [publicWorkouts, setPublicWorkouts] = useState([]);

  // Returns boolean for if a workout is in savedWorkouts
  const workoutIsSaved = (workout) => {
    return savedWorkouts.map((each) => each._id).includes(workout._id);
  };

  const addToSavedWorkouts = async (workout) => {
    const added = await addUserSavedWorkout(user._id, workout._id);

    if (added) setSavedWorkouts((prev) => [...prev, workout]);
  };

  const removeFromSavedWorkouts = async (workout) => {
    const removed = await removeUserSavedWorkout(user._id, workout._id);

    if (removed) setSavedWorkouts((prev) => prev.filter((item) => item._id !== workout._id));
  };

  const getSavedWorkouts = async () => {
    const workouts = await getWorkoutsFromIdArray(user.savedWorkouts);
    setSavedWorkouts(workouts.reverse());
  };

  const getAllPublicWorkouts = async () => {
    const workouts = await getPublicWorkouts();
    setPublicWorkouts(workouts);
  };

  useEffect(() => {
    // Get all public workouts
    getAllPublicWorkouts();

    // Get all workotus saved by the user
    if (user) getSavedWorkouts();
  }, [user]);

  return (
    <WorkoutFeedContainer>
      <PublicWorkouts
        workouts={publicWorkouts}
        workoutIsSaved={workoutIsSaved}
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
