import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import Layout from "../components/Layout";
import Workout from "../components/workoutLog/Workout";
import UserWorkouts from "../components/workoutLog/UserWorkouts";
// Utils
import { getExercisesFromIdArray } from "../utils/ApiSupply";
import { getCurrYearMonthDay } from "../utils/general";
// Context
import { useStoreState, useStoreDispatch, saveWorkoutLog } from "../store";

export default function workoutLog() {
  const dispatch = useStoreDispatch();
  const { user } = useStoreState();

  const [loading, setLoading] = useState(false);
  const [currentDayData, setCurrentDayData] = useState({}); // {isoDate, timeInSeconds, completed, workout_id}
  const [yearMonthDay, setYearMonthDay] = useState({}); // {year, month, day}
  const [workoutNote, setWorkoutNote] = useState("");

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

  // Accepts a workout from user's workoutLog and sets workout and currentDay data
  const setPageState = async (dayData) => {
    setLoading(true);

    // Check if workout exists
    if (dayData) {
      // Grab all exercise_ids from the workout
      const idArr = dayData.exerciseData.map((each) => each.exercise_id);
      // Get all exercise information
      const exerciseData = await getExercisesFromIdArray(idArr);

      dayData.exerciseData.map((each, i) => {
        if (each.exercise_id === exerciseData[i]._id) each.exercise = exerciseData[i];
      });

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

    // Styles
    const fontStyle = dayIsSelected
      ? { boxShadow: "0 0 10px grey" }
      : { color: "#aaa", transform: "scale(.9)" };
    const backgroundStyle = dayData ? { background: "#e3f7ff" } : {};

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
    const currDate = new Date();
    const date = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate());

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

    const saved = await saveWorkoutLog(dispatch, updatedWorkoutLog, user._id);
    console.log(saved);

    // Clear the workout note
    setWorkoutNote("");
  };

  const displayWorkout = async (clicked) => {
    // Grab all the exercise_ids from the workout
    const idArr = clicked.exercises.map((each) => each.exercise_id);

    // Query for exercise data using the idArr
    const exerciseData = await getExercisesFromIdArray(idArr);

    // Sort the array based on the order of the idArr
    exerciseData.sort((a, b) => idArr.indexOf(a._id) - idArr.indexOf(b._id));

    // Create exercise key in each exercise to hold exercise data
    clicked.exercises.map((each, i) => (each.exercise = exerciseData[i]));

    setCurrentDayData((prev) => ({
      ...prev,
      workoutName: clicked.name,
      exerciseData: clicked.exercises,
    }));

    setWorkoutNote("");
  };

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
          <LoadingWorkout>
            {[...new Array(5).keys()].map((i) => (
              <li className="exercise" key={i}>
                <ul>
                  <li className="set" key={"set1"}></li>
                  <li className="set" key={"set2"}></li>
                  <li className="set" key={"set3"}></li>
                </ul>
              </li>
            ))}
          </LoadingWorkout>
        ) : (
          <>
            {currentDayData.exerciseData ? (
              <Workout
                saveWorkout={saveWorkout}
                currentDayData={currentDayData}
                handleWeightChange={handleWeightChange}
                handleWorkoutNoteChange={handleWorkoutNoteChange}
                workoutNote={workoutNote}
              />
            ) : (
              <FallbackText>
                No Workout has been recored today. Select a workout from one of your workouts below.
              </FallbackText>
            )}
          </>
        )}

        <UserWorkouts displayWorkout={displayWorkout} />
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
  justify-content: center;
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
      box-shadow: 0 0 5px grey;
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

  @media (max-width: 500px) {
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
  max-width: 300px;
  margin: 1rem 0.25rem;
  padding: 1rem;

  @media (max-width: 500px) {
    width: 98%;
    max-width: 100%;
  }
`;

const LoadingWorkout = styled.ul`
  width: 100%;
  padding-top: 7rem;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;

  .exercise {
    box-shadow: 0 0 5px grey;
    border-radius: 10px;
    padding: 0.5rem;
    min-width: 55%;
    max-width: 100%;

    margin: 0.5rem 0;

    ul {
      width: fit-content;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .set {
        margin: 1rem;
        padding: 3rem;
      }
    }
  }

  @media (max-width: 500px) {
    .exercise {
      width: 98%;

      ul {
        width: 100%;

        .set {
          width: 100%;
        }
      }
    }
  }
`;
