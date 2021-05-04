import { useState, useEffect } from "react";
import styled from "styled-components";

import Layout from "../components/Layout";
import ExerciseList from "../components/workoutBuilder/ExerciseList";
import UserWorkouts from "../components/workoutBuilder/UserWorkouts";
import CustomWorkout from "../components/workoutBuilder/CustomWorkout";
import { getExercisesFromIdArray, postNewWorkout, updateExistingWorkout } from "../utils/ApiSupply";

import { useStoreState } from "../store";

export default function workoutBuilder() {
  const { user } = useStoreState();

  const [customWorkout, setCustomWorkout] = useState({
    name: "New Workout",
    creator_id: null,
    exercises: [],
    isPublic: false,
  });
  const [workoutSavedSuccessfuly, setWorkoutSavedSuccessfuly] = useState(null);

  // Returns boolean for whether or not an exercise exists in customWorkoutExercises
  const isExerciseInCustomWorkout = (exercise_id) => {
    const { exercises } = customWorkout;
    return exercises.map((item) => item.exercise_id).includes(exercise_id);
  };

  // Adds NEW exercises to the end of the customWorkout.exercises
  const addExercise = (exercise) => {
    // Exercise cannot already be in the customWorkout
    if (!isExerciseInCustomWorkout(exercise._id)) {
      setCustomWorkout((prev) => {
        return {
          ...prev,
          exercises: [
            ...prev.exercises,
            { exercise: exercise, exercise_id: exercise._id, sets: [] },
          ],
        };
      });
    }
  };

  // Removes an exercise from customWorkout.exercises
  const removeExercise = (exercise) => {
    const { exercises } = customWorkout;
    const filteredArr = exercises.filter((each) => each.exercise_id !== exercise._id);

    setCustomWorkout((prev) => {
      return { ...prev, exercises: filteredArr };
    });
  };

  // Resets custom workout state
  const clearCustomWorkout = () => {
    setCustomWorkout({ name: "New Workout", creator_id: null, exercises: [], isPublic: false });
  };

  // Handles changes for customWorkoutName
  const handleWorkoutNameChange = (e) => {
    setCustomWorkout((prev) => {
      return { ...prev, name: e.target.value };
    });
  };

  const handlePrivacyChange = () => {
    setCustomWorkout((prev) => {
      return { ...prev, isPublic: !prev.isPublic };
    });
  };

  //
  const handleRepChange = (e, exerciseIndex, setIndex) => {
    const num = Number(e.target.value);

    const { exercises } = customWorkout;

    // Update the reps for specified set
    exercises[exerciseIndex].sets[setIndex].reps = num;

    setCustomWorkout((prev) => {
      return { ...prev, exercises: exercises };
    });
  };

  const handleSetChange = (method, exerciseIndex) => {
    const { exercises } = customWorkout;

    switch (method) {
      case "add":
        // Add empty set to spedified exercise
        exercises[exerciseIndex].sets.push({ reps: 0, weight: 0 });
        break;
      case "remove":
        // Remove last set from spedified exercise
        exercises[exerciseIndex].sets.pop();
        break;
    }

    setCustomWorkout((prev) => {
      return { ...prev, exercises: exercises };
    });
  };

  const displaySavedWorkout = async (workout) => {
    // Grab all the exercise_ids from the workout
    const idArr = workout.exercises.map((each) => each.exercise_id);

    // Query for exercise data using the idArr
    const exerciseData = await getExercisesFromIdArray(idArr);

    // Sort the array based on the order of the idArr
    exerciseData.sort((a, b) => idArr.indexOf(a._id) - idArr.indexOf(b._id));

    // Create exercise key in each exercise to hold exercise data
    workout.exercises.map((each, i) => {
      each.exercise = exerciseData[i];
    });

    setCustomWorkout(workout);
  };

  const saveCustomWorkout = async () => {
    const { exercises } = customWorkout;
    // Only take exercise_id and sets (exercise data not needed for DB)
    const composedExercises = exercises.map(({ exercise_id, sets }) => {
      return { exercise_id, sets };
    });

    const composedWorkout = {
      ...customWorkout,
      exercises: composedExercises,
    };

    if (composedWorkout.creator_id === user._id) {
      // Workout owner is editing existing workout
      const saveStatus = await updateExistingWorkout(composedWorkout);
      setWorkoutSavedSuccessfuly(saveStatus);
    } else {
      // User is editing a non-user-owned workout or building a new workout
      composedWorkout.creator_id = user._id;
      if (!user.isAdmin) composedWorkout.isPublic = false;
      delete composedWorkout._id;

      const saveStatus = await postNewWorkout(composedWorkout);
      setWorkoutSavedSuccessfuly(saveStatus);
    }

    clearCustomWorkout();
  };

  // Remove saved successfully notification after 5 seconds
  useEffect(() => {
    if (workoutSavedSuccessfuly) {
      setTimeout(() => {
        setWorkoutSavedSuccessfuly(null);
      }, 5000);
    }
  }, [workoutSavedSuccessfuly]);

  return (
    <Layout>
      <Container>
        <section>
          <CustomWorkout
            user={user}
            customWorkout={customWorkout}
            workoutSavedSuccessfuly={workoutSavedSuccessfuly}
            handleWorkoutNameChange={handleWorkoutNameChange}
            handlePrivacyChange={handlePrivacyChange}
            handleRepChange={handleRepChange}
            handleSetChange={handleSetChange}
            clearCustomWorkout={clearCustomWorkout}
            removeExercise={removeExercise}
            saveCustomWorkout={saveCustomWorkout}
          />

          <UserWorkouts
            workoutSavedSuccessfuly={workoutSavedSuccessfuly}
            customWorkout={customWorkout}
            clearCustomWorkout={clearCustomWorkout}
            displaySavedWorkout={displaySavedWorkout}
          />
        </section>

        <ExerciseList
          isExerciseInCustomWorkout={isExerciseInCustomWorkout}
          addExercise={addExercise}
          removeExercise={removeExercise}
        />
      </Container>
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
