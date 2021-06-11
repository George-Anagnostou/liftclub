import { useState } from "react";
import styled from "styled-components";
// Components
import ExerciseList from "../components/builder/ExerciseList";
import UserWorkouts from "../components/builder/UserWorkouts";
import CustomWorkout from "../components/builder/CustomWorkout";
// Context
import { useStoreState } from "../store";

export default function builder() {
  const { user } = useStoreState();

  const [showUserWorkouts, setShowUserWorkouts] = useState(false);
  const [workoutSavedSuccessfuly, setWorkoutSavedSuccessfuly] = useState(null);
  const [customWorkout, setCustomWorkout] = useState({
    name: "",
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
    setCustomWorkout({ name: "", creator_id: null, exercises: [], isPublic: false });
  };

  const toggleUserWorkouts = () => setShowUserWorkouts(!showUserWorkouts);

  return (
    <Container>
      <UserWorkoutToggle onClick={toggleUserWorkouts} className={showUserWorkouts ? "pressed" : ""}>
        <p>Templates</p>
      </UserWorkoutToggle>

      <UserWorkouts
        workoutSavedSuccessfuly={workoutSavedSuccessfuly}
        customWorkout={customWorkout}
        clearCustomWorkout={clearCustomWorkout}
        setCustomWorkout={setCustomWorkout}
        showUserWorkouts={showUserWorkouts}
      />

      <CustomWorkout
        user={user}
        customWorkout={customWorkout}
        setCustomWorkout={setCustomWorkout}
        workoutSavedSuccessfuly={workoutSavedSuccessfuly}
        clearCustomWorkout={clearCustomWorkout}
        removeExercise={removeExercise}
        setWorkoutSavedSuccessfuly={setWorkoutSavedSuccessfuly}
      />

      <ExerciseList
        isExerciseInCustomWorkout={isExerciseInCustomWorkout}
        addExercise={addExercise}
        removeExercise={removeExercise}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
`;

const UserWorkoutToggle = styled.button`
  align-self: flex-end;
  font-size: 1.1rem;
  color: inherit;
  margin: 0 0 0.5rem;
  border-radius: 5px;
  padding: 0.5rem;
  transition: all 0.2s ease;

  border: 2px solid ${({ theme }) => theme.accent};
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.accentText};

  &.pressed {
    background: ${({ theme }) => theme.accentSoft};
  }
`;
