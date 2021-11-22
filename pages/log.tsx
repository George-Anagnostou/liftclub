import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import DateScroll from "../components/workoutLog/DateScroll";
import WorkoutContainer from "../components/workoutLog/WorkoutContainer";
import QuickStart from "../components/workoutLog/QuickStart";
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

  const deleteWorkout = async () => {
    if (!currentWorkoutLogItem || !user) return;
    // If user never saved the workout
    if (!user.workoutLog[selectedDate]) return setCurrentWorkoutLogItem(null);

    const deleted = await deleteDayFromWorkoutLog(dispatch, user._id, selectedDate);
    if (deleted) setCurrentWorkoutLogItem(null);
  };

  const displayOnTheFlyWorkout = () => {
    const newLogItem = createNewWorkoutLogItem();
    setCurrentWorkoutLogItem(newLogItem);
  };

  const displayPremadeWorkout = async (workout: Workout) => {
    const newLogItem = {
      ...createNewWorkoutLogItem(),
      exerciseData: workout.exercises,
      workout_id: workout._id,
      workout: workout,
    };
    // Set page state without exercise names or workout name
    setCurrentWorkoutLogItem(newLogItem);

    const workoutData = await addExerciseDataToWorkout(workout);

    // Set page state again with exercise names and workout name
    setCurrentWorkoutLogItem({
      ...newLogItem,
      exerciseData: workoutData.exercises,
      // workout: workoutData, Only uncomment this if more than the workout name is needed
    });
  };

  const displayWorkoutLogItem = async (logItem: WorkoutLogItem) => {
    // Set page state without exercise names or workout name
    setCurrentWorkoutLogItem(logItem);

    if (logItem.workout_id) {
      // Get premade workout from workout_id
      const workoutData = await getWorkoutFromId(logItem.workout_id);
      logItem.workout = workoutData || undefined;
    }
    logItem = await addExerciseDataToLoggedWorkout(logItem);
    // Set page state again with exercise names and workout name
    setCurrentWorkoutLogItem(logItem);
  };

  useEffect(() => {
    const insertWorkoutData = async (logItem: WorkoutLogItem | undefined) => {
      logItem ? displayWorkoutLogItem(logItem) : setCurrentWorkoutLogItem(null);
    };
    if (isSignedIn && user) insertWorkoutData(user.workoutLog[selectedDate]);
  }, [isSignedIn]);

  return (
    <MainContainer>
      <DateScroll
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setCurrentWorkoutLogItem={setCurrentWorkoutLogItem}
        displayWorkoutLogItem={displayWorkoutLogItem}
      />

      {currentWorkoutLogItem && (
        <WorkoutContainer
          selectedDate={selectedDate}
          currentWorkoutLogItem={currentWorkoutLogItem}
          setCurrentWorkoutLogItem={setCurrentWorkoutLogItem}
          deleteWorkout={deleteWorkout}
        />
      )}

      <div style={currentWorkoutLogItem ? { display: "none" } : {}}>
        <QuickStart
          displayOnTheFlyWorkout={displayOnTheFlyWorkout}
          displayPremadeWorkout={displayPremadeWorkout}
          selectedDate={selectedDate}
        />
      </div>
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
