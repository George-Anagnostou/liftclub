import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import Layout from "../components/Layout";
import SavedWorkouts from "../components/workoutFeed/SavedWorkouts";
import PublicWorkouts from "../components/workoutFeed/PublicWorkouts";
// Utils
import { getPublicWorkouts, getWorkoutsFromIdArray, saveSavedWorkouts } from "../utils/api";
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

  const updateStateAndSaveToDB = (workoutArr) => {
    // Update local state
    setSavedWorkouts(workoutArr);
    // Grab workout ids and save to DB
    const idArr = workoutArr.map((each) => each._id);
    saveSavedWorkouts(idArr, user._id);
  };

  const addToSavedWorkouts = (workout) => {
    if (!workoutIsSaved(workout)) {
      const updatedWorkouts = [...savedWorkouts, workout];
      updateStateAndSaveToDB(updatedWorkouts);
    }
  };

  const removeFromSavedWorkouts = (workout) => {
    const updatedWorkouts = savedWorkouts.filter((each) => each._id !== workout._id);
    updateStateAndSaveToDB(updatedWorkouts);
  };

  const getSavedWorkouts = async () => {
    const workouts = await getWorkoutsFromIdArray(user.savedWorkouts);

    // Sort the array based on the order of the user.savedWorkouts
    workouts.sort((a, b) => user.savedWorkouts.indexOf(a._id) - user.savedWorkouts.indexOf(b._id));

    setSavedWorkouts(workouts);
  };

  const getAllPublicWorkouts = async () => {
    const workouts = await getPublicWorkouts();
    setPublicWorkouts(workouts);
  };

  useEffect(() => {
    // Get all public workouts
    getAllPublicWorkouts();

    if (user) {
      // Get all workotus saved by the user
      getSavedWorkouts();
    }
  }, [user]);

  return (
    <Layout>
      <WorkoutFeedContainer>
        <PublicWorkouts
          workouts={publicWorkouts}
          workoutIsSaved={workoutIsSaved}
          removeFromSavedWorkouts={removeFromSavedWorkouts}
          addToSavedWorkouts={addToSavedWorkouts}
        />

        <SavedWorkouts workouts={savedWorkouts} removeFromSavedWorkouts={removeFromSavedWorkouts} />
      </WorkoutFeedContainer>
    </Layout>
  );
}

const WorkoutFeedContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;

  margin-top: 55px;
`;
