import React, { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import WorkoutContainer from "../components/workoutLog/WorkoutContainer";
import UserWorkouts from "../components/workoutLog/UserWorkouts";
import LoadingSpinner from "../components/LoadingSpinner";
import SaveButton from "../components/workoutLog/SaveButton";
import DateScroll from "../components/workoutLog/DateScroll";
// Utils
import { getCurrYearMonthDay, addExerciseDataToWorkout, stripTimeAndCompareDates } from "../utils";
// Context
import { useStoreState } from "../store";
// API
import {
  saveUserWorkoutLog,
  deleteWorkoutFromWorkoutLog,
  getDateFromUserWorkoutLog,
} from "../utils/api";
// Interfaces
import { WorkoutLogItem, WorkoutLog, Workout } from "../utils/interfaces";

export default function log() {
  const { user } = useStoreState();

  const [loading, setLoading] = useState(true);
  const [workoutLog, setWorkoutLog] = useState<WorkoutLog>([]);
  const [currentDayData, setCurrentDayData] = useState<WorkoutLogItem | null>(null);
  const [displayedDate, setDisplayedDate] = useState(() => getCurrYearMonthDay());
  const [prevBestData, setPrevBestData] = useState<WorkoutLogItem | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Accepts a workout from user's workoutLog and sets page state
  const setPageState = (dayData: WorkoutLogItem | null) => {
    setLoading(true);

    // Check if workout exists
    if (dayData) {
      // Search for previous best for dayData.workout_id;
      findPrevBestData(dayData);

      setCurrentDayData(dayData);
    } else {
      setCurrentDayData(null);
    }

    setLoading(false);
  };

  const fetchAndSetDateData = async (isoDate: string) => {
    const hasWorkout = getDayDataFromWorkoutLog(isoDate);
    if (!hasWorkout) return setPageState(null);

    setLoading(true);
    // Fetch the workout for today
    const dayData = await getDateFromUserWorkoutLog(user!._id, isoDate);
    setPageState(dayData || null);
  };

  const findPrevBestData = (dayData: WorkoutLogItem) => {
    if (!user) return;

    let indexOfWorkout = user.workoutLog.length - 1; // Default with last index

    // If the workout has a been saved set index to the previous of it
    if (dayData.completed) {
      indexOfWorkout =
        user.workoutLog.findIndex((workout) => workout.isoDate === dayData.isoDate) - 1;
    }

    for (let i = indexOfWorkout; i >= 0; i--) {
      if (user.workoutLog[i].workout_id == dayData.workout_id) {
        setPrevBestData(user.workoutLog[i]);
        return;
      }
    }

    //If no prev best has been found
    setPrevBestData(null);
  };

  // Accepts an ISO date and finds the matching date in workoutLog
  const getDayDataFromWorkoutLog = (targetIsoDate: string) => {
    let dayData: WorkoutLogItem | undefined;

    dayData = workoutLog.find((item: WorkoutLogItem) => item.isoDate === targetIsoDate);

    return dayData;
  };

  // Set page state when a new date is selected
  const changeCurrentDayData = async (numOfDaysToShift: number): Promise<void> => {
    const { year, month, day } = getCurrYearMonthDay();
    const date = new Date(year, month, day);

    date.setDate(date.getDate() + numOfDaysToShift);

    // Selected date must be different than the current
    if (date.toISOString() !== currentDayData?.isoDate) {
      setLoading(true);

      const newYear = date.getFullYear();
      const newMonth = date.getMonth();
      const newDay = date.getDate();
      setDisplayedDate({ year: newYear, month: newMonth, day: newDay });

      // Find the workout for the new date
      fetchAndSetDateData(date.toISOString());
    }
  };

  // Posts currentDayData to DB
  const saveWorkout = async () => {
    if (!currentDayData) return;

    setSaveLoading(true);

    // Make array for exerciseData in DB
    const composedExercises = currentDayData.exerciseData.map((each) => ({
      exercise_id: each.exercise_id,
      sets: each.sets,
    }));

    // Get index of our currDayData
    const indexOfCurrDayData = workoutLog.findIndex(
      (workout) => workout.isoDate === currentDayData.isoDate
    );

    // Define log to send to DB
    let updatedWorkoutLog: WorkoutLog;

    if (indexOfCurrDayData > -1) {
      // Update existing workout
      const clone = [...workoutLog];

      clone[indexOfCurrDayData] = {
        ...currentDayData,
        exerciseData: composedExercises,
      };

      updatedWorkoutLog = clone;
    } else {
      // Create new workoutLog entry aand sort by isoDate
      updatedWorkoutLog = [
        ...workoutLog,
        {
          isoDate: currentDayData.isoDate,
          workout_id: currentDayData.workout_id,
          exerciseData: composedExercises,
          workoutName: currentDayData.workoutName,
          workoutNote: currentDayData.workoutNote,
          completed: true,
        },
      ].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    }

    const saved = await saveUserWorkoutLog(updatedWorkoutLog, user!._id);

    setWorkoutLog(updatedWorkoutLog);

    // Re-trigger animations
    setSaveSuccess(false);
    setSaveSuccess(saved);

    setSaveLoading(false);
  };

  const deleteWorkout = async () => {
    if (currentDayData && currentDayData.isoDate) {
      const deleted = await deleteWorkoutFromWorkoutLog(user!._id, currentDayData.isoDate);

      if (deleted) {
        setWorkoutLog(workoutLog.filter((each) => each.isoDate !== currentDayData.isoDate));
        setPageState(null);
      }
    }
  };

  const displayWorkout = async (clicked: Workout) => {
    const mergedData = await addExerciseDataToWorkout(clicked);

    const { year, month, day } = displayedDate;

    const composedData = {
      workoutName: mergedData.name,
      exerciseData: mergedData.exercises,
      workout_id: mergedData._id,
      isoDate: new Date(year, month, day).toISOString(),
      workoutNote: "",
      completed: false,
    };

    setPageState(composedData);
  };

  const handleWorkoutNoteChange = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentDayData({ ...currentDayData!, workoutNote: target.value });
  };

  // Sets weight for a specific workout. Takes the event value and exercise name
  const handleWeightChange = (
    { target }: React.ChangeEvent<HTMLInputElement>,
    exerciseIndex: number,
    setIndex: number
  ) => {
    // Cast value to number or use empty str
    const value = target.value === "" ? "" : Number(target.value);

    const exerciseData = currentDayData?.exerciseData;

    if (exerciseData) {
      exerciseData[exerciseIndex].sets[setIndex].weight = value;
      setCurrentDayData({ ...currentDayData!, exerciseData });
    }
  };

  // Remove Saved notification after 3 seconds
  useEffect(() => {
    let resetTimeout: NodeJS.Timeout;

    if (saveSuccess) resetTimeout = setTimeout(() => setSaveSuccess(null), 3000);

    return () => clearTimeout(resetTimeout);
  }, [saveSuccess]);

  useEffect(() => {
    const loadCurrDayWorkout = async (isoDate: string) => {
      // Fetch the workout for today
      const dayData = await getDateFromUserWorkoutLog(user!._id, isoDate);
      setPageState(dayData || null);
    };

    // workoutLog is used to update DateScroll UI when saving or removing a workout
    if (user) {
      setWorkoutLog(user.workoutLog);

      const { year, month, day } = getCurrYearMonthDay();
      const currIsoDate = new Date(year, month, day).toISOString();
      const latestDate: string = user.workoutLog[workoutLog.length - 1]?.isoDate || currIsoDate;

      // If latestDate is today's date, set page state with fetched data
      stripTimeAndCompareDates(latestDate, currIsoDate)
        ? loadCurrDayWorkout(currIsoDate)
        : setPageState(null);
    }
  }, [user]);

  return (
    <MainContainer>
      <DateScroll
        changeCurrentDayData={changeCurrentDayData}
        getDayDataFromWorkoutLog={getDayDataFromWorkoutLog}
        displayedDate={displayedDate}
        workoutLog={workoutLog}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {currentDayData && (
            <SaveButton
              saveWorkout={saveWorkout}
              saveSuccess={saveSuccess}
              saveLoading={saveLoading}
            />
          )}

          {currentDayData ? (
            <WorkoutContainer
              currentDayData={currentDayData}
              handleWeightChange={handleWeightChange}
              handleWorkoutNoteChange={handleWorkoutNoteChange}
              prevBestData={prevBestData}
              deleteWorkout={deleteWorkout}
            />
          ) : (
            <>
              <FallbackText>
                No workout logged. To start a workout, select a workout from one of the tabs below.
              </FallbackText>

              <UserWorkouts displayWorkout={displayWorkout} />
            </>
          )}
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
  padding: 0 0.5rem;
`;

const FallbackText = styled.h3`
  font-weight: 300;
  max-width: 100%;
  padding: 1rem;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textLight};
  border-radius: 10px;
  margin: 0 0 0.5rem;
`;
