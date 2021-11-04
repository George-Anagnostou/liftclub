import React, { useEffect, useState } from "react";
import styled from "styled-components";
import update from "immutability-helper";
// Components
import TeamWorkouts from "../components/workoutLog/TeamWorkouts";
import UserWorkouts from "../components/workoutLog/UserWorkouts";
import LoadingSpinner from "../components/LoadingSpinner";
import WorkoutContainer from "../components/workoutLog/WorkoutContainer";
import DateScroll from "../components/workoutLog/DateScroll";
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
import { getWorkoutFromId } from "../utils/api";
// Interfaces
import { Workout, WorkoutLogItem } from "../utils/interfaces";

export default function log() {
  const { user, isSignedIn } = useUserState();
  const dispatch = useUserDispatch();

  const [loading, setLoading] = useState(true);
  const [currentDayData, setCurrentDayData] = useState<WorkoutLogItem | null>(null);
  const [selectedDate, setSelectedDate] = useState(() =>
    dateToISOWithLocal(new Date()).substring(0, 10)
  );

  // Accepts a workout from user's workoutLog and sets page state
  const setPageState = (dayData: WorkoutLogItem | null) => {
    setCurrentDayData(dayData);
    setLoading(false);
  };

  const deleteWorkout = async () => {
    if (!currentDayData || !user) return;

    // If user never saved the workout
    if (!user.workoutLog[selectedDate]) return setPageState(null);

    const deleted = await deleteDayFromWorkoutLog(dispatch, user._id, selectedDate);

    if (deleted) setPageState(null);
  };

  const displayWorkout = async (clicked: Workout) => {
    const mergedData = await addExerciseDataToWorkout(clicked);

    const composedData: WorkoutLogItem = {
      exerciseData: mergedData.exercises,
      workout_id: mergedData._id,
      workoutNote: "",
      completed: false,
      workout: mergedData,
    };

    setPageState(composedData);
  };

  const handleWorkoutNoteChange = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (currentDayData) setCurrentDayData({ ...currentDayData, workoutNote: target.value });
  };

  // Sets weight for a specific workout. Takes the event value and exercise name
  const handleWeightChange = (
    { target }: React.ChangeEvent<HTMLInputElement>,
    exerciseIndex: number,
    setIndex: number
  ) => {
    // Cast value to number or use empty str
    const value = target.value === "" ? "" : Number(target.value);

    if (currentDayData?.exerciseData) {
      setCurrentDayData((prev) =>
        update(prev, {
          exerciseData: { [exerciseIndex]: { sets: { [setIndex]: { weight: { $set: value } } } } },
        })
      );
    }
  };

  useEffect(() => {
    const insertWorkoutData = async (logItem: WorkoutLogItem | undefined) => {
      if (logItem) {
        const workoutData = await getWorkoutFromId(logItem.workout_id);
        const mergedData = await addExerciseDataToLoggedWorkout(logItem);

        mergedData.workout = workoutData || undefined;
        setPageState(mergedData);
      } else {
        setPageState(null);
      }
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
      />

      {loading ? (
        <LoadingSpinner />
      ) : currentDayData ? (
        <WorkoutContainer
          selectedDate={selectedDate}
          currentDayData={currentDayData}
          handleWeightChange={handleWeightChange}
          handleWorkoutNoteChange={handleWorkoutNoteChange}
          deleteWorkout={deleteWorkout}
        />
      ) : (
        <>
          <FallbackText>
            No workout logged. To start a workout, select a workout from one of the tabs below.
          </FallbackText>

          <TeamWorkouts displayWorkout={displayWorkout} selectedDate={selectedDate} />

          <UserWorkouts displayWorkout={displayWorkout} />
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

const FallbackText = styled.h3`
  font-weight: 300;
  max-width: 100%;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textLight};
  border-radius: 10px;
  margin: 0 0 0.5rem;
`;
