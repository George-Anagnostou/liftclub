import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import SavedWorkouts from "../components/feed/SavedWorkouts";
import PublicWorkouts from "../components/feed/PublicWorkouts";
// Utils
import {
  addUserSavedWorkout,
  getPublicWorkouts,
  getWorkoutsFromIdArray,
  removeUserSavedWorkout,
} from "../utils/api";
// Context
import { useStoreState } from "../store";
// Interfaces
import { Workout } from "../utils/interfaces";

export default function feed() {
  const { user } = useStoreState();

  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [publicWorkouts, setPublicWorkouts] = useState<Workout[]>([]);

  // Returns boolean for if a workout is in savedWorkouts
  const workoutIsSaved = (workout: Workout) => {
    return savedWorkouts.map((each) => each._id).includes(workout._id);
  };

  const addToSavedWorkouts = async (workout: Workout) => {
    const added = await addUserSavedWorkout(user!._id, workout._id);
    if (added) setSavedWorkouts((prev) => [workout, ...prev]);
  };

  const removeFromSavedWorkouts = async (workout: Workout) => {
    const removed = await removeUserSavedWorkout(user!._id, workout._id);
    if (removed) setSavedWorkouts((prev) => prev.filter((item) => item._id !== workout._id));
  };

  const getSavedWorkouts = async () => {
    const workouts = await getWorkoutsFromIdArray(user!.savedWorkouts!);
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
