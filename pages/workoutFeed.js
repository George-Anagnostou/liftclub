import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import Layout from "../components/Layout";
// Utils
import {
  getExercisesFromIdArray,
  getPublicWorkouts,
  getWorkoutsFromIdArray,
  saveSavedWorkouts,
} from "../utils/ApiSupply";
// Context
import { useStoreState } from "../store";
import WorkoutList from "../components/workoutFeed/WorkoutList";

export default function workoutFeed() {
  const { user } = useStoreState();

  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [publicWorkouts, setPublicWorkouts] = useState([]);
  const [workoutsInViewMode, setWorkoutsInViewMode] = useState([]);

  // Returns boolean for if a workout is in savedWorkouts
  const workoutIsSaved = (workout) => {
    return savedWorkouts.map((each) => each._id).includes(workout._id);
  };

  // Returns boolean for if a workout_id is in workoutsInViewMode
  const workoutIsInViewMode = (uid) => {
    return workoutsInViewMode.includes(uid);
  };

  // Sets state for opening and closing specific workout view mode
  const toggleWorkoutView = ({ section, workout, workoutIndex }) => {
    // Create a unique string to identify which workouts from which columns are in view mode
    const uid = String(section + " " + workout._id);

    if (workoutIsInViewMode(uid)) {
      // Close view mode
      setWorkoutsInViewMode((prev) => prev.filter((each) => each !== uid));
    } else {
      // Open view mode
      setWorkoutsInViewMode((prev) => [...prev, uid]);
      getExerciseDataForWorkout(section, workout, workoutIndex);
    }
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

  const getExerciseDataForWorkout = async (section, workout, workoutIndex) => {
    const idArr = workout.exercises.map((each) => each.exercise_id);
    const exerciseData = await getExercisesFromIdArray(idArr);

    // Sort the array based on the order of the idArr
    exerciseData.sort((a, b) => idArr.indexOf(a._id) - idArr.indexOf(b._id));

    switch (section) {
      case "public":
        const clonePW = [...publicWorkouts];
        clonePW[workoutIndex].exercises.map((each, i) => (each.exercise = exerciseData[i]));

        setPublicWorkouts(clonePW);
        break;

      case "saved":
        const cloneSW = [...savedWorkouts];
        cloneSW[workoutIndex].exercises.map((each, i) => (each.exercise = exerciseData[i]));

        setSavedWorkouts(cloneSW);
        break;
    }
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
      <h2>Workout Feed</h2>
      <WorkoutFeedContainer>
        <WorkoutList
          section="public"
          workouts={publicWorkouts}
          toggleWorkoutView={toggleWorkoutView}
          workoutIsSaved={workoutIsSaved}
          removeFromSavedWorkouts={removeFromSavedWorkouts}
          addToSavedWorkouts={addToSavedWorkouts}
          workoutIsInViewMode={workoutIsInViewMode}
        />
        <WorkoutList
          section="saved"
          workouts={savedWorkouts}
          toggleWorkoutView={toggleWorkoutView}
          workoutIsSaved={workoutIsSaved}
          removeFromSavedWorkouts={removeFromSavedWorkouts}
          addToSavedWorkouts={addToSavedWorkouts}
          workoutIsInViewMode={workoutIsInViewMode}
        />
      </WorkoutFeedContainer>
    </Layout>
  );
}

const WorkoutFeedContainer = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
