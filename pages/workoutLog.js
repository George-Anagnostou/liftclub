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
  addExerciseDataToWorkout,
} from "../utils";
// Context
import { useStoreState, useStoreDispatch, saveWorkoutLog } from "../store";
import { fetchDateFromUserWorkoutLog } from "../store/actions/userActions";

export default function workoutLog() {
  const dispatch = useStoreDispatch();
  const { user } = useStoreState();

  const [loading, setLoading] = useState(false);
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
    const { year, month, day } = getCurrYearMonthDay();

    setYearMonthDay({ year, month, day });

    const currIsoDate = new Date(year, month, day).toISOString();

    // Find the workout for today
    const dayData = await fetchDateFromUserWorkoutLog(user._id, currIsoDate);
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
  const setPageState = (dayData) => {
    setLoading(true);

    // Check if workout exists
    if (dayData) {
      // Search for previous best for dayData.workout_id;
      findPrevBestData(dayData);

      setCurrentDayData(dayData);
      setWorkoutNote(dayData.workoutNote || "");
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

    return (
      <div
        className={`${dayIsSelected ? "selected" : "notSelected"} ${
          dayData ? "hasDayData" : "noDayData"
        }`}
      >
        {date.getDate() === 1 && <h2>{String(date).substring(3, 7)}</h2>}
        <h5>{String(date).substring(0, 3)}</h5>
        <h3>{String(date).substring(8, 11)}</h3>
      </div>
    );
  };

  // Set page state when a new date is selected
  const changeCurrentDayData = async (numOfDaysToShift) => {
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
      const dayData = await fetchDateFromUserWorkoutLog(user._id, date.toISOString());
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
    setSavedSuccessfully(saved);
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
    const reset = setTimeout(() => setSavedSuccessfully(null), 3000);
    return () => clearTimeout(reset);
  }, [savedSuccessfully]);

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
          {[...Array(90).keys()].map((numDays) => (
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
                savedSuccessfully={savedSuccessfully}
              />
            ) : (
              <FallbackText>To start a workout, select a workout from below.</FallbackText>
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
      border-radius: 5px;
      padding: 0.5rem;
      transition: all 0.2s ease-in-out;

      color: ${({ theme }) => theme.text};
      background: ${({ theme }) => theme.buttonLight};
      border: 1px solid ${({ theme }) => theme.border};
      box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};

      h4,
      h5 {
        font-weight: 500;
        margin: 0.25rem;
      }
      h2 {
        font-weight: 400;
      }

      &.selected {
        box-shadow: 0 4px 8px ${({ theme }) => theme.boxShadow};
      }
      &.notSelected {
        transform: scale(0.85);
        transform-origin: bottom;
        background: ${({ theme }) => theme.buttonMed};
      }
      &.hasDayData {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.shades[1]};
      }
      &.noDayData {
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

const FallbackText = styled.h3`
  color: ${({ theme }) => theme.textLight};
  font-weight: 300;
  margin: 2rem 1rem;
  max-width: 100%;
`;
