import { useState, useEffect } from "react";
import styled from "styled-components";
import useSWR from "swr";

import Layout from "../components/Layout";
import { useStoreContext } from "../context/state";
import {
  getExercisesFromIdArray,
  getUserMadeWorkouts,
  postNewWorkout,
  updateExistingWorkout,
} from "../utils/ApiSupply";

const muscleGroups = [
  "all",
  "upper back",
  "lower back",
  "shoulder",
  "upper arm",
  "forearm",
  "chest",
  "hip",
  "upper leg",
  "lower leg",
  "core",
];

const motions = [
  "all",
  "pulling",
  "pushing",
  "thrusting",
  "curling",
  "squatting",
  "rotating",
  "crunching",
  "breathing",
];

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function workoutBuilder() {
  const { data, error } = useSWR("/api/exercises", fetcher);

  const { user } = useStoreContext();

  const [workoutSavedSuccessfuly, setWorkoutSavedSuccessfuly] = useState(null);
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [displayedExercises, setDisplayedExercises] = useState([]);
  const [customWorkoutExercises, setCustomWorkoutExercises] = useState([]);
  const [customWorkoutName, setCustomWorkoutName] = useState("New Workout");

  const loadUserMadeWorkouts = async () => {
    const userMadeWorkouts = await getUserMadeWorkouts(user._id);
    setUserWorkouts(userMadeWorkouts);
  };

  // Returns boolean for whether or not an exercise exists in customWorkoutExercises
  const isExerciseInCustomWorkout = (exercise_id) => {
    return customWorkoutExercises.map((item) => item.exercise_id).includes(exercise_id);
  };

  // Adds NEW exercises to customWorkoutExercises
  const addExercise = (exercise) => {
    if (!isExerciseInCustomWorkout(exercise._id)) {
      setCustomWorkoutExercises((prev) => [
        ...prev,
        { exercise: exercise, exercise_id: exercise._id, sets: [] },
      ]);
    }
  };

  // Removes an exercise from customWorkoutExercises
  const removeExercise = (exercise) => {
    const filteredArr = customWorkoutExercises.filter((each) => each.exercise_id !== exercise._id);
    setCustomWorkoutExercises(filteredArr);
  };

  // Resets custom workout state
  const clearCustomWorkout = () => {
    setCustomWorkoutExercises([]);
    setCustomWorkoutName("New Workout");
  };

  // Handles changes for customWorkoutName
  const handleWorkoutNameChange = (e) => {
    setCustomWorkoutName(e.target.value);
  };

  //
  const handleRepChange = (e, exercise_id, setIndex) => {
    const num = Number(e.target.value);
    // Copy state
    const customExercisesCopy = [...customWorkoutExercises];
    // Update the reps for specified set
    customExercisesCopy.map((item) => {
      if (item.exercise_id === exercise_id) {
        item.sets[setIndex].reps = num || "";
      }
    });

    setCustomWorkoutExercises(customExercisesCopy);
  };

  const changeSetLength = (method, exerciseIndex) => {
    // Copy  state
    const customExercisesCopy = [...customWorkoutExercises];

    switch (method) {
      case "add":
        // Add empty set to spedified exercise
        customExercisesCopy[exerciseIndex].sets.push({ reps: 0, weight: 0, weightUnit: "lbs" });
        break;
      case "remove":
        // Remove last set from spedified exercise
        customExercisesCopy[exerciseIndex].sets.pop();
        break;
    }

    setCustomWorkoutExercises(customExercisesCopy);
  };

  const saveWorkoutToDB = async () => {
    // Only take exercise_id and sets (exercise data not needed for DB)
    const workoutForDB = customWorkoutExercises.map(({ exercise_id, sets }) => {
      return { exercise_id, sets };
    });

    // Search for workout by name if it already exists
    const existingWorkout = userWorkouts.find((workout) => workout.name === customWorkoutName);

    if (existingWorkout) {
      // Put exercises in correct format (without exercise data)
      existingWorkout.exercises = workoutForDB;

      try {
        const res = await updateExistingWorkout(existingWorkout);
        setWorkoutSavedSuccessfuly(res.status === 204);
      } catch (e) {
        console.log(e);
      }
    } else {
      // Create workout obj to send to DB
      const composedWorkout = {
        name: customWorkoutName,
        creator_id: user._id,
        exercises: workoutForDB,
        public: false,
      };

      try {
        const res = await postNewWorkout(composedWorkout);
        setWorkoutSavedSuccessfuly(res.status === 201);
      } catch (e) {
        console.log(e);
      }
    }

    clearCustomWorkout();
    loadUserMadeWorkouts();
  };

  const filterExercisesBy = async ({ field, value }) => {
    try {
      let res;
      // Don't use "field" and "value" for searching by "all"
      value === "all"
        ? (res = await fetch(`/api/exercises`))
        : (res = await fetch(`/api/exercises?${field}=${value}`));

      const queried = await res.json();
      setDisplayedExercises(queried);
    } catch (e) {
      console.log(e);
    }
  };

  const displaySavedWorkout = async (workout) => {
    // Grab all the exercise_ids from the workout
    const idArr = workout.exercises.map((each) => each.exercise_id);
    // Query for exercise data using the idArr
    const exerciseData = await getExercisesFromIdArray(idArr);

    // Create exercise key in each exercise to hold exercise data
    workout.exercises.map((each, i) => {
      // Ensure ids match
      if (each.exercise_id === exerciseData[i]._id) {
        each.exercise = exerciseData[i];
      }
      return each;
    });

    setCustomWorkoutExercises(workout.exercises);
    setCustomWorkoutName(workout.name);
  };

  // Remove saved successfully notification after 5 seconds
  useEffect(() => {
    if (workoutSavedSuccessfuly) {
      setTimeout(() => {
        setWorkoutSavedSuccessfuly(null);
      }, 5000);
    }
  }, [workoutSavedSuccessfuly]);

  // Call loadUserMadeWorkouts if user is logged in
  useEffect(() => {
    if (user) {
      loadUserMadeWorkouts();
    }
  }, [user]);

  // Set exercises once SWR fetches the exercise data
  useEffect(() => {
    if (data) setDisplayedExercises(data);
  }, [data]);
  // Used with SWR
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <Layout>
      <Container>
        <CustomWorkout>
          <div className="workout-control">
            <div className="workout-header">
              <h3>Custom Workout</h3>
              {workoutSavedSuccessfuly && (
                <p style={{ color: "green" }}>Workout saved successfully</p>
              )}
              {Boolean(customWorkoutExercises.length) && (
                <>
                  <button onClick={saveWorkoutToDB}>Save</button>
                  <button onClick={clearCustomWorkout}>Clear</button>
                </>
              )}
            </div>

            <label htmlFor="workoutName">Workout Name:</label>
            <input
              type="text"
              name="workoutName"
              id="workoutName"
              value={customWorkoutName}
              onChange={handleWorkoutNameChange}
            />
          </div>

          {customWorkoutExercises.map(({ exercise, sets }, i) => (
            <li key={exercise._id}>
              <p>
                <span>{i + 1}.</span> {exercise.name}
              </p>

              {sets.map(({ reps }, j) => (
                <div key={j}>
                  <span>set {j + 1}.</span>
                  <input
                    type="number"
                    name="reps"
                    id="reps"
                    value={reps}
                    onChange={(e) => handleRepChange(e, exercise._id, j)}
                  />{" "}
                  <span>reps</span>
                </div>
              ))}

              <div>
                <button onClick={() => changeSetLength("add", i)}>Add set</button>
                <button onClick={() => changeSetLength("remove", i)}>Remove set</button>
              </div>

              <button onClick={() => removeExercise(exercise)}>Remove</button>
            </li>
          ))}
        </CustomWorkout>

        <ExerciseList>
          <div className="exercise-control">
            <div>
              <label htmlFor="muscleGroup">Muscle Group: </label>
              <select
                name="muscleGroup"
                id="muscleGroup"
                onChange={(e) => filterExercisesBy({ field: "muscleGroup", value: e.target.value })}
              >
                {muscleGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="motion">Motion: </label>
              <select
                name="motion"
                id="motion"
                onChange={(e) => filterExercisesBy({ field: "motion", value: e.target.value })}
              >
                {motions.map((motion) => (
                  <option key={motion} value={motion}>
                    {motion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {displayedExercises.map((each) => (
            <li
              key={each._id}
              style={isExerciseInCustomWorkout(each._id) ? { background: "#dddddd" } : {}}
            >
              <h3>{each.name}</h3>
              <p>
                <span>motion:</span>
                {each.motion}
              </p>

              <p>
                <span>muscle group:</span> {each.muscleGroup}
              </p>
              <p>
                <span>muscle worked:</span> {each.muscleWorked}
              </p>
              <p>
                <span>equipment:</span> {each.equipment}
              </p>
              <button onClick={() => addExercise(each)}>Add</button>
            </li>
          ))}
        </ExerciseList>

        <UserWorkouts>
          <h3>Your Workouts</h3>
          {userWorkouts.map((each, i) => (
            <li key={i} onClick={() => displaySavedWorkout(each)}>
              {each.name}
            </li>
          ))}
        </UserWorkouts>
      </Container>
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
const Container = styled.div`
  height: 90vh;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    height: fit-content;
  }
`;

const CustomWorkout = styled.ul`
  border: 1px solid black;
  width: 25%;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;

  .workout-control {
    text-align: center;
    width: 100%;
    margin: 0.5rem 0;
    .workout-header {
      margin-bottom: 1rem;
      button {
        margin: 0 0.5rem;
        padding: 0.5rem;
      }
    }
    input {
      width: 50%;
    }
  }

  li {
    border: 1px solid grey;
    background: rgb(215, 221, 247);
    width: 100%;
    max-width: 150px;
    margin: 0.5rem;
    text-align: center;
    text-transform: capitalize;

    display: flex;
    flex-direction: column;
    input {
      width: 3rem;
    }
    span {
      font-weight: 300;
      font-size: 0.7rem;
    }
    button {
      margin-top: 0.5rem;
      cursor: pointer;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ExerciseList = styled.ul`
  border: 1px solid black;
  width: 60%;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;

  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;

  .exercise-control {
    position: sticky;
    top: 0;
    background: #e2e2e2;
    width: 100%;
    border-bottom: 1px solid black;
    text-align: center;
    div {
      width: 50%;
      display: inline-block;
    }
  }

  li {
    border: 1px solid grey;
    width: 100%;
    max-width: 150px;
    margin: 1rem;
    text-align: center;
    text-transform: capitalize;

    display: flex;
    flex-direction: column;

    p {
      display: block;
      width: 100%;
      background: #d9f0f0;
      border-bottom: 1px solid #d3d3d3;
      text-align: left;
      font-weight: 300;
      span {
        font-weight: 100;
        display: block;
        text-transform: uppercase;
        font-size: 0.6rem;
        width: 100%;
      }
    }

    button {
      cursor: pointer;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const UserWorkouts = styled.ul`
  border: 1px solid black;
  width: 15%;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;

  li {
    cursor: pointer;
    border: 1px solid grey;
    padding: 1rem;
    width: 100%;
    margin: 1rem;
    text-align: center;
    text-transform: capitalize;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    &:hover {
      background: grey;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
