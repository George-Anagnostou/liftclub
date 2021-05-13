import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import Layout from "../components/Layout";
import Workout from "../components/workoutLog/Workout";
import UserWorkouts from "../components/workoutLog/UserWorkouts";
import LoadingSpinner from "../components/LoadingSpinner";
// Utils
import {
  getCurrYearMonthDay,
  addExerciseDataToLoggedWorkout,
  addExerciseDataToWorkout,
} from "../utils/general";
// Context
import { useStoreState, useStoreDispatch, saveWorkoutLog } from "../store";

export default function workoutLog() {
  const dispatch = useStoreDispatch();
  const { user } = useStoreState();

  const [loading, setLoading] = useState(false);
  const [currentDayData, setCurrentDayData] = useState({});
  const [yearMonthDay, setYearMonthDay] = useState({}); // {year, month, day}
  const [workoutNote, setWorkoutNote] = useState("");
  const [prevBestData, setPrevBestData] = useState(null);
  const [savedNotification, setSavedNotification] = useState(null);

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

  const setDataToToday = () => {
    const { year, month, day } = getCurrYearMonthDay();

    setYearMonthDay({ year, month, day });

    const currIsoDate = new Date(year, month, day).toISOString();

    // Find the workout for today
    const dayData = getDayDataFromWorkoutLog(currIsoDate);
    setPageState(dayData);
  };

  const findPrevBestData = (dayData) => {
    let indexOfWorkout = user.workoutLog.length - 1; // Default with last index

    // If the workout has a been saved set index to the previous of it
    if (dayData.isoDate) {
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

  // Accepts a workout from user's workoutLog and sets workout and currentDay data
  const setPageState = async (dayData) => {
    setLoading(true);

    // Check if workout exists
    if (dayData) {
      // Search for previous best for dayData.workout_id;
      findPrevBestData(dayData);

      const mergedData = await addExerciseDataToLoggedWorkout(dayData);

      setCurrentDayData(mergedData);
      setWorkoutNote(mergedData.workoutNote || "");
    } else {
      setCurrentDayData({});
    }

    setLoading(false);
  };

  // Accepts an ISO date and finds the matching date in user.workoutLog
  const getDayDataFromWorkoutLog = (targetIsoDate) => {
    const dayData = user?.workoutLog.find((item) => item.isoDate === targetIsoDate);
    return dayData;
  };

  // Format the date for the DateBar
  const formatDate = (numOfDaysToShift) => {
    const currDate = new Date();
    const date = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());

    date.setDate(date.getDate() + numOfDaysToShift);

    const dayData = getDayDataFromWorkoutLog(date.toISOString());

    const { year, month, day } = yearMonthDay;
    const dayIsSelected =
      date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;

    // Styles
    const fontStyle = dayIsSelected
      ? { boxShadow: "0 3px 5px #757575" }
      : { color: "#aaa", transform: "scale(.9)" };
    const backgroundStyle = dayData ? { background: "#EAEEFF" } : {};

    return (
      <div style={{ ...fontStyle, ...backgroundStyle }}>
        {date.getDate() === 1 && <h2>{String(date).substring(3, 7)}</h2>}
        <h5>{String(date).substring(0, 3)}</h5>
        <h3>{String(date).substring(8, 11)}</h3>
      </div>
    );
  };

  // Set page state when a new date is selected
  const changeCurrentDayData = (numOfDaysToShift) => {
    const { year, month, day } = getCurrYearMonthDay();
    const date = new Date(year, month, day);

    date.setDate(date.getDate() + numOfDaysToShift);

    // Selected date must be different than the current
    if (date.toISOString() !== currentDayData.isoDate) {
      const newYear = date.getFullYear();
      const newMonth = date.getMonth();
      const newDay = date.getDate();
      setYearMonthDay({ year: newYear, month: newMonth, day: newDay });

      // Find the workout for the new date
      const dayData = getDayDataFromWorkoutLog(date.toISOString());
      setPageState(dayData);
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
      // Create new workoutLog entry
      const { year, month, day } = yearMonthDay;

      // Add new workout and sort by isoDate
      updatedWorkoutLog = [
        ...user.workoutLog,
        {
          isoDate: new Date(year, month, day).toISOString(),
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

    const saved = await saveWorkoutLog(dispatch, updatedWorkoutLog, user._id);
    setSavedNotification(saved);
  };

  const displayWorkout = async (clicked) => {
    const mergedData = await addExerciseDataToWorkout(clicked);

    const composedData = {
      workoutName: mergedData.name,
      exerciseData: mergedData.exercises,
      workout_id: mergedData._id,
    };

    setCurrentDayData((prev) => ({
      ...prev,
      ...composedData,
    }));

    findPrevBestData(composedData);

    setWorkoutNote("");
  };

  useEffect(() => {
    setTimeout(() => setSavedNotification(null), 3000);
  }, [savedNotification]);

  useEffect(() => {
    // Set yearMonthDay to today
    const { year, month, day } = getCurrYearMonthDay();
    setYearMonthDay({ year, month, day });

    // Set page state if user is logged in
    if (user) {
      setDataToToday();
    }
  }, [user]);

  return (
    <Layout>
      <MainContainer>
        <DateBar>
          {[...Array(32).keys()].map((numDays) => (
            <li onClick={() => changeCurrentDayData(-numDays)} className="date" key={-numDays}>
              {formatDate(-numDays)}
            </li>
          ))}
        </DateBar>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {currentDayData.exerciseData ? (
              <Workout
                saveWorkout={saveWorkout}
                currentDayData={currentDayData}
                handleWeightChange={handleWeightChange}
                handleWorkoutNoteChange={handleWorkoutNoteChange}
                workoutNote={workoutNote}
                prevBestData={prevBestData}
                savedNotification={savedNotification}
              />
            ) : (
              <FallbackText>
                No Workout has been recored today. Select a workout from one of your workouts below.
              </FallbackText>
            )}

            <UserWorkouts displayWorkout={displayWorkout} />
          </>
        )}
      </MainContainer>
    </Layout>
  );
}

/**
 *
 *
 *
 *
 * START CSS
 *
 *
 *
 *
 *
 */
const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const DateBar = styled.ul`
  display: flex;
  align-items: flex-end;
  flex-direction: row-reverse;

  width: 100%;
  padding: 10px;
  overflow-x: scroll;

  .date {
    min-width: 60px;
    margin: 0 0.5rem;
    cursor: pointer;
    border-radius: 10px;
    height: fit-content;
    text-align: center;

    div {
      box-shadow: none;
      border: 1px solid #ccc;
      border-radius: 10px;
      transition: all 0.1s ease-in-out;
      padding: 0.5rem;

      h4,
      h5 {
        font-weight: 500;
        margin: 0.25rem;
      }
      h2 {
        color: #4b83b0;
        font-weight: 400;
      }
    }
  }

  @media (max-width: 425px) {
    /* Remove scroll bar on mobile */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const FallbackText = styled.h5`
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  margin: 1rem 0.25rem;
  padding: 1rem;
  width: 98%;
  max-width: 100%;
`;
