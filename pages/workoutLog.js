import { useEffect, useState } from "react";
import styled from "styled-components";

import { useStoreContext } from "../context/state";
import Layout from "../components/Layout";
import { getExercisesFromIdArray, getUserMadeWorkouts, saveWorkoutLog } from "../utils/ApiSupply";
import Workout from "../components/workoutLog/Workout";
import UserWorkouts from "../components/workoutLog/UserWorkouts";

export default function workoutLog() {
  const { user, setUserState } = useStoreContext();

  const [loading, setLoading] = useState(false);
  const [currentDayData, setCurrentDayData] = useState({}); // {isoDate, timeInSeconds, completed, workout_id}
  const [yearMonthDay, setYearMonthDay] = useState({}); // {year, month, day}
  const [userMadeWorkouts, setUserMadeWorkouts] = useState([]);
  const [workoutNote, setWorkoutNote] = useState("");

  const handleWorkoutNoteChange = (e) => {
    setWorkoutNote(e.target.value);
  };

  // Sets weight for a specific workout. Takes the event value and exercise name
  const handleWeightChange = (e, exercise, setIndex) => {
    // Cast value to number
    const num = Number(e.target.value);

    // Copy current exercises
    const { exerciseData } = currentDayData;

    const edit = exerciseData.find((item) => item.exercise_id === exercise._id);

    edit.sets[setIndex].weight = num;

    exerciseData.map((each) => {
      if (each.exercise_id === edit.exercise_id) each = edit;
    });

    setCurrentDayData((prev) => ({ ...prev, exerciseData: exerciseData }));
  };

  const handleWeightUnitChange = (e, exercise, setIndex) => {
    const unit = e.target.value;

    // Copy current exercises
    const { exerciseData } = currentDayData;

    const edit = exerciseData.find((item) => item.exercise_id === exercise._id);

    edit.sets[setIndex].weightUnit = unit;

    exerciseData.map((each) => {
      if (each.exercise_id === edit.exercise_id) each = edit;
    });

    setCurrentDayData((prev) => ({ ...prev, exerciseData: exerciseData }));
  };

  const setDataToToday = () => {
    const date = new Date();
    const currYear = date.getFullYear();
    const currMonth = date.getMonth();
    const currDay = date.getDate();

    setYearMonthDay({ year: currYear, month: currMonth, day: currDay });

    const currIsoDate = new Date(currYear, currMonth, currDay).toISOString();

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
    const dayData = user.workoutLog.find((item) => item.isoDate === targetIsoDate);
    return dayData;
  };

  // Change to tomorrow's or yesterday's workout data
  const changeCurrentDayData = (direction) => {
    const { year, month, day } = yearMonthDay;
    const date = new Date(year, month, day);

    switch (direction) {
      case "tomorrow":
        date.setDate(date.getDate() + 1);
        break;
      case "yesterday":
        date.setDate(date.getDate() - 1);
        break;
    }

    const newYear = date.getFullYear();
    const newMonth = date.getMonth();
    const newDay = date.getDate();

    setYearMonthDay({ year: newYear, month: newMonth, day: newDay });

    // Find the workout for the new date
    const dayData = getDayDataFromWorkoutLog(date.toISOString());
    setPageState(dayData);
  };

  // Posts currentDayData to DB
  const saveWorkout = async () => {
    // Make sure there are exercises to save
    if (currentDayData.exerciseData) {
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
        const workoutLogClone = [...user.workoutLog];

        // // update the index of current workout
        workoutLogClone[indexOfCurrDayData] = {
          ...currentDayData,
          workoutNote: workoutNote,
          exerciseData: composedExercises,
        };

        updatedWorkoutLog = workoutLogClone;
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

      const userData = await saveWorkoutLog(updatedWorkoutLog, user._id);
      setUserState(userData);

      // Clear the workout note
      setWorkoutNote("");
    }
  };

  const displaySavedWorkout = async (clicked) => {
    // Grab all the exercise_ids from the workout
    const idArr = clicked.exercises.map((each) => each.exercise_id);
    // Query for exercise data using the idArr
    const exerciseData = await getExercisesFromIdArray(idArr);

    // Create exercise key in each exercise to hold exercise data
    clicked.exercises.map((each, i) => (each.exercise = exerciseData[i]));

    setCurrentDayData((prev) => ({
      ...prev,
      workoutName: clicked.name,
      exerciseData: clicked.exercises,
    }));

    setWorkoutNote("");
  };

  // Set page state if user is logged in
  useEffect(() => {
    const date = new Date();
    const currYear = date.getFullYear();
    const currMonth = date.getMonth();
    const currDay = date.getDate();

    setYearMonthDay({ year: currYear, month: currMonth, day: currDay });

    if (user) {
      setDataToToday();

      // Get all workouts made by the user
      const getUserWorkouts = async () => {
        const userWorkouts = await getUserMadeWorkouts(user._id);
        setUserMadeWorkouts(userWorkouts);
      };
      getUserWorkouts();
    }
  }, [user]);

  return (
    <Layout>
      <MainContainer>
        <HeaderContainer>
          <button onClick={() => changeCurrentDayData("yesterday")}>{"<"}</button>
          <div className="date" onClick={setDataToToday}>
            <h1>{`${yearMonthDay.month + 1}/${yearMonthDay.day}/${yearMonthDay.year}`}</h1>
            <h5>{currentDayData.workoutName || "No Workout"}</h5>
          </div>
          <button onClick={() => changeCurrentDayData("tomorrow")}>{">"}</button>
        </HeaderContainer>

        {loading ? (
          <FallbackText>Loading...</FallbackText>
        ) : (
          <>
            {currentDayData.exerciseData ? (
              <Workout
                saveWorkout={saveWorkout}
                currentDayData={currentDayData}
                handleWeightChange={handleWeightChange}
                handleWeightUnitChange={handleWeightUnitChange}
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

        <UserWorkouts
          userMadeWorkouts={userMadeWorkouts}
          displaySavedWorkout={displaySavedWorkout}
        />
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
  padding: 0.5rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  .date {
    margin: 0 1rem;
    height: 70px;
    padding: 0 1rem;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 5px grey;

    display: grid;
    place-items: center;

    h1,
    h5 {
      text-transform: uppercase;
    }
  }

  button {
    flex: 1;
    font-size: 3rem;
    height: 70px;
    padding: 0 0.5rem;
    background: transparent;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 5px grey;

    display: grid;
    place-items: center;
  }

  @media (max-width: 500px) {
    justify-content: space-between;
    width: 100%;
  }
`;

const FallbackText = styled.h5`
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  max-width: 300px;
  margin: 2rem auto;
  padding: 1rem;

  @media (max-width: 500px) {
    width: 100%;
    max-width: 100%;
  }
`;
