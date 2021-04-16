import { useState, useEffect } from "react";
import styled from "styled-components";
import useSWR from "swr";

import Layout from "../components/Layout";
import { useStoreContext } from "../context/state";
import {
  getExercisesFromIdArray,
  getPublicWorkouts,
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
  const [publicWorkouts, setPublicWorkouts] = useState([]);
  const [displayedExercises, setDisplayedExercises] = useState([]);
  const [customWorkoutExercises, setCustomWorkoutExercises] = useState([]);
  const [customWorkoutName, setCustomWorkoutName] = useState("New Workout");
  const [customWorkoutPublic, setCustomWorkoutPublic] = useState(false);

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
    setCustomWorkoutPublic(false);
  };

  // Handles changes for customWorkoutName
  const handleWorkoutNameChange = (e) => {
    setCustomWorkoutName(e.target.value);
  };

  const handlePrivacyChange = () => {
    setCustomWorkoutPublic((prev) => !prev);
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
    const composedExerciseData = customWorkoutExercises.map(({ exercise_id, sets }) => {
      return { exercise_id, sets };
    });

    // Search for workout by name if it already exists
    const existingWorkout = userWorkouts.find((workout) => workout.name === customWorkoutName);

    if (existingWorkout) {
      // Put exercises in correct format (without exercise data)
      existingWorkout.exercises = composedExerciseData;
      existingWorkout.isPublic = customWorkoutPublic;

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
        exercises: composedExerciseData,
        isPublic: customWorkoutPublic,
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
    setCustomWorkoutPublic(workout.isPublic);
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

  // Get all public workouts on page mount
  useEffect(() => {
    const getAllPublicWorkouts = async () => {
      const allPublicWorkouts = await getPublicWorkouts();
      console.log(allPublicWorkouts);
      setPublicWorkouts(allPublicWorkouts);
    };
    getAllPublicWorkouts();
  }, []);

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
              {workoutSavedSuccessfuly && (
                <p style={{ color: "green" }}>Workout saved successfully</p>
              )}
              {Boolean(customWorkoutExercises.length) && (
                <button onClick={saveWorkoutToDB}>Save</button>
              )}
              <h3>Custom Workout</h3>
              {Boolean(customWorkoutExercises.length) && (
                <button onClick={clearCustomWorkout}>Clear</button>
              )}
            </div>
            <div className="workout-data">
              <label htmlFor="workoutName">Name: </label>
              <input
                type="text"
                name="workoutName"
                id="workoutName"
                value={customWorkoutName}
                onChange={handleWorkoutNameChange}
              />
              {user?.isAdmin && (
                <>
                  <label htmlFor="public">Public</label>
                  <input
                    type="checkbox"
                    name="public"
                    id="public"
                    checked={customWorkoutPublic}
                    onChange={handlePrivacyChange}
                  />
                </>
              )}
            </div>
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

        <UserWorkouts>
          <ul>
            <h3>Your Workouts</h3>
            {userWorkouts.map((each, i) => (
              <li
                key={i}
                onClick={() => displaySavedWorkout(each)}
                style={customWorkoutName === each.name ? { background: "rgb(215, 221, 247)" } : {}}
              >
                {each.name}
              </li>
            ))}
          </ul>
          <ul>
            <h3>Public Workouts</h3>
            {publicWorkouts.map((each, i) => (
              <li
                key={i}
                onClick={() => displaySavedWorkout(each)}
                style={customWorkoutName === each.name ? { background: "rgb(215, 221, 247)" } : {}}
              >
                {each.name}
              </li>
            ))}
          </ul>
        </UserWorkouts>

        <ExerciseList>
          <div className="exercise-control">
            <h3>Exercises</h3>
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
              style={isExerciseInCustomWorkout(each._id) ? { background: "#c9c9c9" } : {}}
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
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  position: relative;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    height: fit-content;
  }
`;

const CustomWorkout = styled.ul`
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  width: 25%;

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
        border: none;
        box-shadow: 0 0 2px grey;
        display: inline-block;
        margin: 0 0.5rem;
        padding: 0.75rem;
      }
      h3 {
        display: inline-block;
      }
    }
    .workout-data {
      display: flex;
      justify-content: center;
      align-items: center;
      label {
        font-size: 0.8rem;
      }
      input[type="text"] {
        width: 50%;
        margin: 0.5rem;
        font-size: 1.2rem;
      }
      input[type="checkbox"] {
        margin: 0.5rem;
        transform: scale(1.7);
        border: none;
      }
    }
  }

  li {
    border-radius: 5px;
    box-shadow: 0 0 5px grey;
    background: rgb(215, 221, 247);
    width: 100%;
    max-width: 150px;
    margin: 0.5rem;
    text-align: center;
    text-transform: capitalize;

    display: flex;
    flex-direction: column;
    div {
      margin: 0.2rem 0;
      flex: 1;

      input {
        width: 3rem;
      }
      span {
        font-weight: 300;
        font-size: 0.7rem;
      }
      button {
        cursor: pointer;
        border: none;
        border-radius: 3px;
        margin: 0.15rem;
      }
    }
    button {
      padding: 0.2rem;
      margin-top: 0.5rem;
      cursor: pointer;
      border: none;
      border-radius: 0 0 5px 5px;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const UserWorkouts = styled.div`
  text-align: center;
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  width: 15%;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  ul {
    width: 100%;

    li {
      border: none;
      border-radius: 5px;
      box-shadow: 0 0 5px grey;

      cursor: pointer;
      padding: 1rem;
      margin: 1rem;
      text-align: center;
      text-transform: capitalize;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;

      &:hover {
        background: #c9c9c9;
      }
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ExerciseList = styled.ul`
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  width: 60%;
  max-height: 85vh;
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
    background: rgb(226, 226, 226);
    width: 100%;

    border-bottom: 1px solid black;
    text-align: center;
    div {
      padding: 0.5rem 0;
      width: 50%;
      display: inline-block;
    }
  }

  li {
    border-radius: 5px;
    box-shadow: 0 0 5px grey;
    width: 100%;
    max-width: 150px;
    min-height: 250px;
    margin: 1rem;
    text-align: center;
    text-transform: capitalize;
    background: rgba(245, 145, 83, 0.185);

    display: flex;
    flex-direction: column;
    h3 {
      padding: 0.5rem 0;
    }
    p {
      flex: 1;
      display: block;
      width: 100%;
      border-bottom: 1px solid #d3d3d3;
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
      padding: 0.5rem 0;
      cursor: pointer;
      background: inherit;
      border: none;
      border-radius: 0 0px 5px 5px;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
