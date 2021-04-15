import { useEffect, useState } from "react";
import styled from "styled-components";

import { formatTime } from "../utils/format";
import { useStoreContext } from "../context/state";
import Layout from "../components/Layout";
import {
  getExercisesFromIdArray,
  getUserMadeWorkouts,
  getWorkoutFromId,
  saveWorkoutLog,
} from "../utils/ApiSupply";

export default function workoutLog() {
  const { user, setUserState } = useStoreContext();

  const [timer, setTimer] = useState(0);
  const [timerState, setTimerState] = useState("reset"); // 'reset' || 'paused' || 'started'
  const [currentDayData, setCurrentDayData] = useState({}); // {isoDate, timeInSeconds, completed, workout_id}
  const [workout, setWorkout] = useState({}); // {exercises[], exercise_id, sets[]}
  const [yearMonthDay, setYearMonthDay] = useState({}); // {year, month, day}
  const [userMadeWorkouts, setUserMadeWorkouts] = useState([]);

  // Accepts a workout from user's workoutLog and sets workout and currentDay data
  const setPageState = async (dayData) => {
    // Check if workout exists
    if (dayData) {
      const workoutData = await getWorkoutFromDB(dayData.workout_id);
      const idArr = workoutData.exercises.map((each) => each.exercise_id);
      const exerciseData = await getExercisesFromIdArray(idArr);

      workoutData.exercises.map((each, i) => {
        each.exercise = exerciseData[i];
        each.sets = dayData.exerciseData[i]?.sets || each.sets;
      });

      setWorkout(workoutData);
      setCurrentDayData(dayData);
    } else {
      setWorkout({});
      setCurrentDayData({});
    }
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
    const newDate = new Date(newYear, newMonth, newDay).toISOString();

    setYearMonthDay({ year: newYear, month: newMonth, day: newDay });

    // Find the workout for the new date
    const dayData = getDayDataFromWorkoutLog(newDate);
    setPageState(dayData);
  };

  // Posts currentDayData to DB
  const saveWorkout = async () => {
    // Make sure there are exercises to save
    if (workout.exercises) {
      // console.log(currentDayData, workout, yearMonthDay, timer);
      const composedExercises = workout.exercises.map((each) => {
        return { exercise_id: each.exercise_id, sets: each.sets };
      });

      const workoutIndexInLog = user.workoutLog.findIndex(
        (workout) => workout.isoDate === currentDayData.isoDate
      );

      let updatedWorkoutLog;

      if (workoutIndexInLog === -1) {
        // Create new workoutLog entry
        const { year, month, day } = yearMonthDay;
        // Add new workout and sort by isoDate
        updatedWorkoutLog = [
          ...user.workoutLog,
          {
            isoDate: new Date(year, month, day).toISOString(),
            timeInSeconds: timer,
            completed: true,
            workout_id: workout._id,
            exerciseData: composedExercises,
          },
        ].sort((a, b) => a.isoDate.localeCompare(b.isoDate));
      } else {
        // Update existing workout
        const newLog = [...user.workoutLog];
        // update the index of current workout
        newLog[workoutIndexInLog] = {
          ...currentDayData,
          exerciseData: composedExercises,
          workout_id: workout._id,
        };

        updatedWorkoutLog = newLog;
      }

      const userData = await saveWorkoutLog(updatedWorkoutLog, user._id);
      setUserState(userData);
    }
  };

  // Sets weight for a specific workout. Takes the event value and exercise name
  const setWeightForExercise = (e, exercise, setIndex) => {
    // Cast value to number
    const num = Number(e.target.value);

    // Copy current exercises
    const { exercises } = workout;

    // Find the exercise being updated
    exercises.map((item) => {
      if (item.exercise_id === exercise._id) {
        // set weight for specified set
        item.sets[setIndex].weight = num;
      }
      return item;
    });

    // update workout state
    setWorkout({ ...workout, exercises });
  };

  const getWorkoutFromDB = async (workout_id) => {
    try {
      // GET workout data
      const workoutData = await getWorkoutFromId(workout_id);

      // Get array of exercise ids
      const exerciseIdArr = workoutData.exercises.map((each) => each.exercise_id);

      // Translate exercise ids into data
      const exerciseData = await getExercisesFromIdArray(exerciseIdArr);

      // Create {exercise: exerciseData} in workoutData
      workoutData.exercises.map((each, i) => {
        // Ensure ids match
        if (each.exercise_id === exerciseData[i]._id) {
          each.exercise = exerciseData[i];
        }
        return each;
      });

      return workoutData;
    } catch (e) {
      console.log(e);
    }
  };

  const displaySavedWorkout = async (clicked) => {
    // Grab all the exercise_ids from the workout
    const idArr = clicked.exercises.map((each) => each.exercise_id);
    // Query for exercise data using the idArr
    const exerciseData = await getExercisesFromIdArray(idArr);

    // Create exercise key in each exercise to hold exercise data
    clicked.exercises.map((each, i) => (each.exercise = exerciseData[i]));

    setWorkout(clicked);
  };

  // Set page state if user is logged in
  useEffect(() => {
    const date = new Date();
    const currYear = date.getFullYear();
    const currMonth = date.getMonth();
    const currDay = date.getDate();

    setYearMonthDay({ year: currYear, month: currMonth, day: currDay });

    if (user) {
      const currIsoDate = new Date(currYear, currMonth, currDay).toISOString();

      // Find the workout for today
      const dayData = getDayDataFromWorkoutLog(currIsoDate);
      setPageState(dayData);

      // Get all workouts made by the user
      const getUserWorkouts = async () => {
        const userWorkouts = await getUserMadeWorkouts(user._id);
        setUserMadeWorkouts(userWorkouts);
      };
      getUserWorkouts();
    }
  }, [user]);

  // Controls for timer state
  useEffect(() => {
    let timerInterval;

    switch (timerState) {
      case "reset":
        // Reset timer to 0
        setTimer(0);
        clearInterval(timerInterval);
        break;
      case "paused":
        // Timer increments by 0
        timerInterval = setInterval(() => setTimer((prev) => prev + 0), 1000);
        break;
      case "started":
        // Timer increments by 1 every second
        timerInterval = setInterval(() => setTimer((prev) => prev + 1), 1000);
        break;
    }

    return () => clearInterval(timerInterval);
  }, [timerState]);

  return (
    <Layout>
      <MainContainer>
        <HeaderContainer>
          <button onClick={() => changeCurrentDayData("yesterday")}>{"<"}</button>
          <div>
            <h1>{workout.name || "No Workout"}</h1>
            <h5>{`${yearMonthDay.month + 1}/${yearMonthDay.day}/${yearMonthDay.year}`}</h5>
          </div>
          <button onClick={() => changeCurrentDayData("tomorrow")}>{">"}</button>
        </HeaderContainer>

        <WorkoutList>
          {workout.exercises?.map(({ exercise, sets }) => (
            <li className="exercise" key={exercise._id}>
              <h3 className="exercise-name">{exercise.name}</h3>
              <p>{exercise.equipment}</p>
              <ul>
                {sets.map(({ reps, weight, weightUnit }, i) => (
                  <li className="set" key={i}>
                    <p>
                      <span>{reps}</span> reps
                    </p>

                    <div>
                      <input
                        type="number"
                        name="weight"
                        id="weight"
                        value={weight || ""}
                        onChange={(e) => setWeightForExercise(e, exercise, i)}
                      />
                      <select name="unit" id="unit" defaultValue={weightUnit}>
                        <option value="lbs">lbs</option>
                        <option value="pin">pin</option>
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </WorkoutList>

        <CompleteButton onClick={saveWorkout}>Save Workout</CompleteButton>

        <UserMadeWorkouts>
          <h3>Your Workouts</h3>
          <ul>
            {userMadeWorkouts.map((workout) => (
              <li key={workout._id} onClick={() => displaySavedWorkout(workout)}>
                <h4>{workout.name}</h4>
                <p>{workout.exercises.length} exercises</p>
              </li>
            ))}
          </ul>
        </UserMadeWorkouts>

        <TimerContainer>
          <h3>{formatTime(timer)}</h3>
          <div>
            <button onClick={() => setTimerState("started")}>Start</button>
            <button onClick={() => setTimerState("paused")}>Pause</button>
            <button onClick={() => setTimerState("reset")}>Reset</button>
          </div>
        </TimerContainer>
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

  div {
    margin: 0 1rem;
    h1 {
      text-transform: uppercase;
    }
  }

  button {
    font-size: 3rem;
    padding: 0.5rem;
    background: transparent;
    border: 1px solid grey;
    border-radius: 3px;
  }
`;

const WorkoutList = styled.ul`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;

  .exercise {
    border: 1px solid grey;
    border-radius: 10px;
    padding: 0.5rem;
    max-width: 100%;

    margin: 1rem;
    text-align: center;

    > h3,
    > p {
      text-transform: uppercase;
    }
    ul {
      width: fit-content;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .set {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem 0;
        width: fit-content;
        margin: 1rem;

        p {
          padding-right: 3rem;
          span {
            font-weight: 700;
            font-size: 3rem;
          }
        }
        div {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          input {
            width: 6.5rem;
            font-size: 3rem;
            font-weight: 200;
          }
          select {
            margin-left: 0.2rem;
            border: 1px solid grey;
            border-radius: 2px;
            font-size: 1.5rem;
            option {
            }
          }
        }
      }
    }
  }
`;

const CompleteButton = styled.button`
  margin: 2rem auto;
  font-size: 1.5rem;
  padding: 0.5rem;
`;

const UserMadeWorkouts = styled.div`
  border: 1px solid grey;
  border-radius: 3px;
  max-width: 100%;
  text-align: center;
  margin-bottom: 2rem;

  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    li {
      cursor: pointer;
      margin: 0.5rem;
      padding: 0.5rem;
      border: 1px solid grey;
      border-radius: 3px;
      &:hover {
        background: #ccc;
      }

      h4 {
        text-transform: capitalize;
        padding-bottom: 0.5rem;
      }
    }
  }
`;

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: 1px solid grey;
  border-radius: 3px;
  padding: 0.5rem 0;
  width: 100%;
  max-width: 325px;
  margin: 2rem auto;
  h3 {
    font-size: 2rem;
  }
  div {
    display: flex;
    justify-content: space-around;
    align-items: center;
    button {
      margin: 0.5rem;
      padding: 0.5rem;
      height: 3rem;
    }
  }
`;
