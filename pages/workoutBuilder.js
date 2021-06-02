import { useState } from "react";
import styled from "styled-components";
// Components
import Layout from "../components/Layout";
import ExerciseList from "../components/workoutBuilder/ExerciseList";
import UserWorkouts from "../components/workoutBuilder/UserWorkouts";
import CustomWorkout from "../components/workoutBuilder/CustomWorkout";
// Context
import { useStoreState } from "../store";

export default function workoutBuilder() {
  const { user } = useStoreState();

  const [workoutSavedSuccessfuly, setWorkoutSavedSuccessfuly] = useState(null);
  const [customWorkout, setCustomWorkout] = useState({
    name: "New Workout",
    creator_id: null,
    exercises: [],
    isPublic: false,
  });

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

  return (
    <Layout>
      <Container>
        <section>
          <CustomWorkout
            user={user}
            customWorkout={customWorkout}
            setCustomWorkout={setCustomWorkout}
            workoutSavedSuccessfuly={workoutSavedSuccessfuly}
            clearCustomWorkout={clearCustomWorkout}
            removeExercise={removeExercise}
            setWorkoutSavedSuccessfuly={setWorkoutSavedSuccessfuly}
          />

          <UserWorkouts
            workoutSavedSuccessfuly={workoutSavedSuccessfuly}
            customWorkout={customWorkout}
            clearCustomWorkout={clearCustomWorkout}
            setCustomWorkout={setCustomWorkout}
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
