import React, { useEffect, useState } from "react";
import styled from "styled-components";
import update from "immutability-helper";
// Components
import DateScroll from "../components/workoutLog/DateScroll";
import LoadingSpinner from "../components/LoadingSpinner";
import WorkoutContainer from "../components/workoutLog/WorkoutContainer";
import QuickStart from "../components/workoutLog/QuickStart";
import TeamWorkouts from "../components/workoutLog/TeamWorkouts";
import UserWorkouts from "../components/workoutLog/UserWorkouts";
// Utils
import {
  addExerciseDataToLoggedWorkout,
  addExerciseDataToWorkout,
  dateToISOWithLocal,
} from "../utils";
// Context
import { useUserDispatch, useUserState } from "../store";
import { deleteDayFromWorkoutLog } from "../store/actions/userActions";
// API
import { getWorkoutFromId } from "../api-lib/fetchers";
// Interfaces
import { Workout, WorkoutLogItem } from "../types/interfaces";

export default function log() {
  const { user, isSignedIn } = useUserState();
  const dispatch = useUserDispatch();

  const [loading, setLoading] = useState(true);
  const [currentWorkoutLogItem, setCurrentWorkoutLogItem] = useState<WorkoutLogItem | null>(null);
  const [selectedDate, setSelectedDate] = useState(() =>
    dateToISOWithLocal(new Date()).substring(0, 10)
  );

  const createNewWorkoutLogItem = (): WorkoutLogItem => {
    return {
      completed: false,
      exerciseData: [],
      workoutNote: "",
    };
  };

  // Accepts a workout from user's workoutLog and sets page state
  const setPageState = (dayData: WorkoutLogItem | null) => {
    setCurrentWorkoutLogItem(dayData);
    setLoading(false);
  };

  const deleteWorkout = async () => {
    if (!currentWorkoutLogItem || !user) return;
    // If user never saved the workout
    if (!user.workoutLog[selectedDate]) return setPageState(null);

    const deleted = await deleteDayFromWorkoutLog(dispatch, user._id, selectedDate);
    if (deleted) setPageState(null);
  };

  const displayPremadeWorkout = async (clicked: Workout) => {
    const newLogItem = createNewWorkoutLogItem();
    const workout = await addExerciseDataToWorkout(clicked);

    const newWorkoutLogItem: WorkoutLogItem = {
      ...newLogItem,
      exerciseData: workout.exercises,
      workout_id: workout._id,
      workout: workout,
    };

    setPageState(newWorkoutLogItem);
  };

  const displayOnTheFlyWorkout = () => {
    const newLogItem = createNewWorkoutLogItem();
    setPageState(newLogItem);
  };

  const displayWorkoutLogItem = async (logItem: WorkoutLogItem) => {
    logItem = await addExerciseDataToLoggedWorkout(logItem);

    if (logItem.workout_id) {
      // Get premade workout from workout_id
      const workoutData = await getWorkoutFromId(logItem.workout_id);
      logItem.workout = workoutData || undefined;
    }

    setPageState(logItem);
  };

  useEffect(() => {
    const insertWorkoutData = async (logItem: WorkoutLogItem | undefined) => {
      logItem ? displayWorkoutLogItem(logItem) : setPageState(null);
    };
    if (isSignedIn && user) insertWorkoutData(user.workoutLog[selectedDate]);
  }, [isSignedIn]);

  return (
    <MainContainer>
      <DateScroll
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setPageState={setPageState}
        setLoading={setLoading}
        displayWorkoutLogItem={displayWorkoutLogItem}
      />

      {loading ? (
        <LoadingSpinner />
      ) : currentWorkoutLogItem ? (
        <WorkoutContainer
          selectedDate={selectedDate}
          currentWorkoutLogItem={currentWorkoutLogItem}
          setCurrentWorkoutLogItem={setCurrentWorkoutLogItem}
          deleteWorkout={deleteWorkout}
        />
      ) : (
        <>
          <QuickStart displayOnTheFlyWorkout={displayOnTheFlyWorkout} />

          <TeamWorkouts displayPremadeWorkout={displayPremadeWorkout} selectedDate={selectedDate} />

          <UserWorkouts displayPremadeWorkout={displayPremadeWorkout} />

          {/* FOR YOU WORKOUTS*/}
        </>
      )}
    </MainContainer>
  );
}

const MainContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 30vh;
  padding: 0 0.5rem 1rem;
`;
