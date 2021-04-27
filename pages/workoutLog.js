import { useEffect, useState } from "react";
import styled from "styled-components";

import { useStoreContext } from "../context/state";
import Layout from "../components/Layout";
import { getExercisesFromIdArray, getUserMadeWorkouts, saveWorkoutLog } from "../utils/ApiSupply";

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
        {!loading ? (
          <>
            {currentDayData.exerciseData ? (
              <>
                <CompleteButton onClick={saveWorkout}>Save Workout</CompleteButton>

                <WorkoutList>
                  {currentDayData.exerciseData?.map(({ exercise, exercise_id, sets }) => (
                    <li className="exercise" key={exercise_id}>
                      <h3 className="exercise-name">{exercise.name}</h3>
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
                                onChange={(e) => handleWeightChange(e, exercise, i)}
                              />
                              <select
                                name="unit"
                                id="unit"
                                defaultValue={weightUnit}
                                onChange={(e) => handleWeightUnitChange(e, exercise, i)}
                              >
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

                <WorkoutNote>
                  <h3>Notes:</h3>
                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="5"
                    value={workoutNote}
                    onChange={handleWorkoutNoteChange}
                  ></textarea>
                </WorkoutNote>
              </>
            ) : (
              <FallbackText>
                No Workout has been recored today. Select a workout from one of your workouts below.
              </FallbackText>
            )}
          </>
        ) : (
          <FallbackText>Loading...</FallbackText>
        )}

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

  @media (max-width: 425px) {
    justify-content: space-between;
    width: 100%;
  }
`;

const CompleteButton = styled.button`
  margin: 1rem auto 0.5rem;
  font-size: 1.5rem;
  padding: 0.5rem;
  background: inherit;
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;

  @media (max-width: 425px) {
    width: 100%;
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
    box-shadow: 0 0 5px grey;
    border-radius: 10px;
    padding: 0.5rem;
    max-width: 100%;

    margin: 0.5rem 0;
    text-align: center;

    h3 {
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
        padding: 0.5rem;
        width: fit-content;
        margin: 1rem auto;

        p {
          padding-right: 2rem;
          font-size: 0.6rem;
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

  @media (max-width: 425px) {
    .exercise {
      width: 100%;
    }
  }
`;

const WorkoutNote = styled.div`
  margin: 1rem auto;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  padding: 1rem;
  text-align: left;

  textarea {
    padding: 0.5rem;
    border-radius: 5px;
    box-shadow: 0 0 5px #b9b9b9;
    border: 1px solid #b9b9b9;
    min-width: 200px;
    max-width: 85vw;
    font-size: 1.2rem;
    font-family: inherit;
  }

  @media (max-width: 425px) {
    width: 100%;
    textarea {
      width: 100%;
      max-width: unset;
    }
  }
`;

const UserMadeWorkouts = styled.div`
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  max-width: 100%;
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;

  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    li {
      width: 45%;
      cursor: pointer;
      margin: 0.5rem;
      padding: 0.5rem 0.2rem;
      border-radius: 5px;
      box-shadow: 0 0 5px grey;
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

const FallbackText = styled.h5`
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  max-width: 300px;
  margin: 2rem auto;
  padding: 1rem;

  @media (max-width: 425px) {
    width: 100%;
    max-width: 100%;
  }
`;
