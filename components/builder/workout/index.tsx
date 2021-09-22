import { useState } from "react";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
// Components
import ExerciseList from "./ExerciseList";
import UserWorkouts from "./UserWorkouts";
import CustomWorkout from "./CustomWorkout";
// Context
import { useStoreState } from "../../../store";
// Interfaces
import { Exercise, Workout } from "../../../utils/interfaces";
import { moveItemInArray } from "../../../utils/";

const CustomWorkoutInit = {
  _id: "",
  name: "",
  creator_id: "",
  creatorName: "",
  exercises: [],
  isPublic: false,
  date_created: "",
  numLogged: 0,
};

const WorkoutBuilder: React.FC = () => {
  const { user } = useStoreState();

  const [exerciseListBottom, setExerciseListBottom] = useState(-80); // number ranging from -80 to 0
  const [workoutSavedSuccessfully, setWorkoutSavedSuccessfully] = useState<boolean | null>(null);
  const [customWorkout, setCustomWorkout] = useState<Workout>(CustomWorkoutInit);

  // Returns boolean for whether or not an exercise exists in customWorkoutExercises
  const isExerciseInCustomWorkout = (exercise_id: string) => {
    const { exercises } = customWorkout;
    return exercises.map((item) => item.exercise_id).includes(exercise_id);
  };

  // Adds NEW exercises to the end of the customWorkout.exercises
  const addExercise = (exercise: Exercise) => {
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
  const removeExercise = (exercise_id: string) => {
    const { exercises } = customWorkout;
    const filteredArr = exercises.filter((each) => each.exercise_id !== exercise_id);

    setCustomWorkout((prev) => {
      return { ...prev, exercises: filteredArr };
    });
  };

  // Resets custom workout state
  const clearCustomWorkout = () => setCustomWorkout(CustomWorkoutInit);

  const handleDragEnd = (result: any) => {
    const startIndex: number = result.source?.index;
    const endIndex: number = result.destination?.index > -1 ? result.destination.index : startIndex;

    if (startIndex === endIndex) return;

    setCustomWorkout((prev) => ({
      ...prev,
      exercises: moveItemInArray(prev.exercises, startIndex, endIndex),
    }));
  };

  return (
    <Container>
      <DragDropContext onDragEnd={handleDragEnd}>
        <CustomWorkout
          user={user}
          customWorkout={customWorkout}
          setCustomWorkout={setCustomWorkout}
          workoutSavedSuccessfully={workoutSavedSuccessfully}
          clearCustomWorkout={clearCustomWorkout}
          removeExercise={removeExercise}
          setWorkoutSavedSuccessfully={setWorkoutSavedSuccessfully}
          setExerciseListBottom={setExerciseListBottom}
        />
      </DragDropContext>

      <UserWorkouts
        workoutSavedSuccessfully={workoutSavedSuccessfully}
        customWorkout={customWorkout}
        clearCustomWorkout={clearCustomWorkout}
        setCustomWorkout={setCustomWorkout}
      />

      <ExerciseList
        isExerciseInCustomWorkout={isExerciseInCustomWorkout}
        addExercise={addExercise}
        removeExercise={removeExercise}
        setExerciseListBottom={setExerciseListBottom}
        exerciseListBottom={exerciseListBottom}
      />
    </Container>
  );
};
export default WorkoutBuilder;

const Container = styled.section`
  display: flex;
  flex-direction: column;
`;
