import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import Workout from "../components/workoutLog/Workout";
import UserWorkouts from "../components/workoutLog/UserWorkouts";
import LoadingSpinner from "../components/LoadingSpinner";
import SaveButton from "../components/workoutLog/SaveButton";
import DateScroll from "../components/workoutLog/DateScroll";
// Utils
import { getCurrYearMonthDay, addExerciseDataToWorkout } from "../utils";
// Context
import { useStoreState } from "../store";
// API
import {
  saveUserWorkoutLog,
  deleteWorkoutFromWorkoutLog,
  getDateFromUserWorkoutLog,
} from "../utils/api";

export default function workoutLog() {
  const { user, isUsingPWA, platform } = useStoreState();

  const [workoutLog, setWorkoutLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDayData, setCurrentDayData] = useState({});
  const [yearMonthDay, setYearMonthDay] = useState({}); // {year, month, day}
  const [workoutNote, setWorkoutNote] = useState("");
  const [prevBestData, setPrevBestData] = useState(null);
  const [savedSuccessfully, setSavedSuccessfully] = useState(null);

  const handleWorkoutNoteChange = (e) => {
    setWorkoutNote(e.target.value);
  };

  // Sets weight for a specific workout. Takes the event value and exercise name
  const handleWeightChange = (e, exerciseIndex, setIndex) => {
    // Cast value to number
    const num = e.target.value === "" ? "" : Number(e.target.value);

    const { exerciseData } = currentDayData;

    exerciseData[exerciseIndex].sets[setIndex].weight = num;

    setCurrentDayData((prev) => ({ ...prev, exerciseData: exerciseData }));
  };

  const setDataToToday = async () => {
    setLoading(true);
    const { year, month, day } = getCurrYearMonthDay();

    setYearMonthDay({ year, month, day });

    const currIsoDate = new Date(year, month, day).toISOString();

    // Find the workout for today
    const dayData = await getDateFromUserWorkoutLog(user._id, currIsoDate);
    setPageState(dayData);
  };

  const findPrevBestData = (dayData) => {
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

  // Accepts a workout from user's workoutLog and sets page state
  const setPageState = (dayData) => {
    // Check if workout exists
    if (dayData) {
      // Search for previous best for dayData.workout_id;
      findPrevBestData(dayData);

      setCurrentDayData(dayData);
      setWorkoutNote(dayData.workoutNote || "");
    } else {
      setCurrentDayData({});
      setWorkoutNote("");
    }

    setLoading(false);
  };

  // Accepts an ISO date and finds the matching date in user.workoutLog
  const getDayDataFromWorkoutLog = (targetIsoDate) => {
    const dayData = workoutLog?.find((item) => item.isoDate === targetIsoDate);
    return dayData;
  };

  // Set page state when a new date is selected
  const changeCurrentDayData = async (numOfDaysToShift) => {
    const { year, month, day } = getCurrYearMonthDay();
    const date = new Date(year, month, day);

    date.setDate(date.getDate() + numOfDaysToShift);

    // Selected date must be different than the current
    if (date.toISOString() !== currentDayData.isoDate) {
      setLoading(true);

      const newYear = date.getFullYear();
      const newMonth = date.getMonth();
      const newDay = date.getDate();
      setYearMonthDay({ year: newYear, month: newMonth, day: newDay });

      // Find the workout for the new date
      const hasWorkout = getDayDataFromWorkoutLog(date.toISOString());
      if (hasWorkout) {
        const dayData = await getDateFromUserWorkoutLog(user._id, date.toISOString());
        setPageState(dayData);
      } else {
        setPageState(null);
      }
    }
  };

  // Posts currentDayData to DB
  const saveWorkout = async () => {
    // Make array for exerciseData in DB
    const composedExercises = currentDayData.exerciseData.map((each) => {
      return { exercise_id: each.exercise_id, sets: each.sets };
    });

    // Get index of our currDayData
    const indexOfCurrDayData = user.workoutLog.findIndex(
      (workout) => workout.isoDate === currentDayData.isoDate
    );

    // Define log to send to DB
    let updatedWorkoutLog;

    if (indexOfCurrDayData > 0) {
      // Update existing workout
      user.workoutLog[indexOfCurrDayData] = {
        ...currentDayData,
        workoutNote: workoutNote,
        exerciseData: composedExercises,
      };

      updatedWorkoutLog = user.workoutLog;
    } else {
      // Create new workoutLog entry aand sort by isoDate
      updatedWorkoutLog = [
        ...user.workoutLog,
        {
          isoDate: currentDayData.isoDate,
          completed: true,
          workout_id: currentDayData.workout_id,
          exerciseData: composedExercises,
          workoutName: currentDayData.workoutName,
          workoutNote: workoutNote,
        },
      ].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    }

    // Remove any remaining exerciseData.exercise
    updatedWorkoutLog.map((day) => {
      day.exerciseData.map((each) => delete each.exercise);
    });

    const userData = await saveUserWorkoutLog(updatedWorkoutLog, user._id);
    setWorkoutLog(userData.workoutLog);
    setSavedSuccessfully(userData);
  };

  const deleteWorkout = async () => {
    if (currentDayData.isoDate) {
      const deleted = await deleteWorkoutFromWorkoutLog(user._id, currentDayData.isoDate);
      setWorkoutLog(deleted);
    }
    setPageState(null);
  };

  const displayWorkout = async (clicked) => {
    const mergedData = await addExerciseDataToWorkout(clicked);

    const { year, month, day } = yearMonthDay;

    const composedData = {
      workoutName: mergedData.name,
      exerciseData: mergedData.exercises,
      workout_id: mergedData._id,
      isoDate: new Date(year, month, day).toISOString(),
    };

    setPageState(composedData);
  };

  useEffect(() => {
    const reset = setTimeout(() => setSavedSuccessfully(null), 3000);
    return () => clearTimeout(reset);
  }, [savedSuccessfully]);

  useEffect(() => {
    // Set yearMonthDay to today
    const { year, month, day } = getCurrYearMonthDay();
    setYearMonthDay({ year, month, day });

    // Set page state if user is logged in
    if (user) {
      // workoutLog is used to update UI for DateScroll on workout save
      setWorkoutLog(user.workoutLog);

      setDataToToday();
    }
  }, [user]);

  return (
    <MainContainer>
      <DateScroll
        changeCurrentDayData={changeCurrentDayData}
        getDayDataFromWorkoutLog={getDayDataFromWorkoutLog}
        yearMonthDay={yearMonthDay}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h1>{isUsingPWA ? "true" : "false"}</h1>
          <h1>{platform}</h1>

          {currentDayData.exerciseData && (
            <SaveButton saveWorkout={saveWorkout} savedSuccessfully={savedSuccessfully} />
          )}

          {currentDayData.exerciseData ? (
            <Workout
              currentDayData={currentDayData}
              handleWeightChange={handleWeightChange}
              handleWorkoutNoteChange={handleWorkoutNoteChange}
              workoutNote={workoutNote}
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
