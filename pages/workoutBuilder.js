import { useState, useEffect } from "react";
import styled from "styled-components";
import useSWR from "swr";

import Layout from "../components/Layout";
import ExerciseList from "../components/workoutBuilder/ExerciseList";
import UserWorkouts from "../components/workoutBuilder/UserWorkouts";
import CustomWorkout from "../components/workoutBuilder/CustomWorkout";
import { useStoreContext } from "../context/state";
import {
  getExercisesFromIdArray,
  getPublicWorkouts,
  getUserMadeWorkouts,
  postNewWorkout,
  updateExistingWorkout,
} from "../utils/ApiSupply";

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
    // Copy state
    const customExercisesCopy = [...customWorkoutExercises];

    switch (method) {
      case "add":
        // Add empty set to spedified exercise
        customExercisesCopy[exerciseIndex].sets.push({ reps: 0, weight: 0 });
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

      const saveStatus = await updateExistingWorkout(existingWorkout);
      setWorkoutSavedSuccessfuly(saveStatus);
    } else {
      // Create workout obj to send to DB
      const composedWorkout = {
        name: customWorkoutName,
        creator_id: user._id,
        exercises: composedExerciseData,
        isPublic: customWorkoutPublic,
      };

      const saveStatus = await postNewWorkout(composedWorkout);
      setWorkoutSavedSuccessfuly(saveStatus);
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
      each.exercise = exerciseData[i];
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
      setPublicWorkouts(allPublicWorkouts);
    };
    getAllPublicWorkouts();
  }, []);

  // Set exercises once SWR fetches the exercise data
  useEffect(() => {
    if (data) setDisplayedExercises(data);
  }, [data]);
  // Used with SWR
  if (error) return <h1>failed to load</h1>;

  return (
    <Layout>
      {data ? (
        <Container>
          <section>
            <CustomWorkout
              user={user}
              workoutSavedSuccessfuly={workoutSavedSuccessfuly}
              customWorkoutExercises={customWorkoutExercises}
              customWorkoutName={customWorkoutName}
              customWorkoutPublic={customWorkoutPublic}
              handleWorkoutNameChange={handleWorkoutNameChange}
              handlePrivacyChange={handlePrivacyChange}
              handleRepChange={handleRepChange}
              changeSetLength={changeSetLength}
              clearCustomWorkout={clearCustomWorkout}
              removeExercise={removeExercise}
              saveWorkoutToDB={saveWorkoutToDB}
            />

            <UserWorkouts
              userWorkouts={userWorkouts}
              displaySavedWorkout={displaySavedWorkout}
              customWorkoutName={customWorkoutName}
              publicWorkouts={publicWorkouts}
            />
          </section>

          <ExerciseList
            filterExercisesBy={filterExercisesBy}
            displayedExercises={displayedExercises}
            isExerciseInCustomWorkout={isExerciseInCustomWorkout}
            addExercise={addExercise}
            removeExercise={removeExercise}
            user={user}
          />
        </Container>
      ) : (
        <h1>Loading...</h1>
      )}
    </Layout>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;

  position: relative;
  margin-top: 0.5rem;
  padding: 0.5rem;

  section {
    display: flex;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: fit-content;

    section {
      flex-direction: column;
    }
  }
`;
