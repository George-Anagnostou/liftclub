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
import Modal from "../../Wrappers/Modal";
import { moveItemInArray } from "../../../utils/";

const CustomWorkoutInit = {
  _id: "",
  name: "",
  creator_id: "",
  creatorName: "",
  exercises: [],
  isPublic: false,
  date_created: "",
};

const WorkoutBuilder: React.FC = () => {
  const { user } = useStoreState();

  const [showUserWorkouts, setShowUserWorkouts] = useState(false);
  const [showExerciseList, setShowExerciseList] = useState(false);
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
  const removeExercise = (exercise: Exercise) => {
    const { exercises } = customWorkout;
    const filteredArr = exercises.filter((each) => each.exercise_id !== exercise._id);

    setCustomWorkout((prev) => {
      return { ...prev, exercises: filteredArr };
    });
  };

  // Resets custom workout state
  const clearCustomWorkout = () => setCustomWorkout(CustomWorkoutInit);

  const handleDragEnd = (result: any) => {
    const startIndex = result.source?.index;
    const endIndex = result.destination?.index || 0;

    if (startIndex === endIndex) return;

    setCustomWorkout((prev) => ({
      ...prev,
      exercises: moveItemInArray(prev.exercises, startIndex, endIndex),
    }));
  };

  return (
    <Container>
      <UserWorkoutToggle
        onClick={() => setShowUserWorkouts(!showUserWorkouts)}
        className={showUserWorkouts ? "pressed" : ""}
      >
        <p>Templates</p>
      </UserWorkoutToggle>

      <UserWorkouts
        workoutSavedSuccessfully={workoutSavedSuccessfully}
        customWorkout={customWorkout}
        clearCustomWorkout={clearCustomWorkout}
        setCustomWorkout={setCustomWorkout}
        showUserWorkouts={showUserWorkouts}
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        <CustomWorkout
          user={user}
          customWorkout={customWorkout}
          setCustomWorkout={setCustomWorkout}
          workoutSavedSuccessfully={workoutSavedSuccessfully}
          clearCustomWorkout={clearCustomWorkout}
          removeExercise={removeExercise}
          setWorkoutSavedSuccessfully={setWorkoutSavedSuccessfully}
          setShowExerciseList={setShowExerciseList}
        />
      </DragDropContext>

      {showExerciseList && (
        <Modal removeModal={() => setShowExerciseList(false)} isOpen={showExerciseList}>
          <ExerciseList
            isExerciseInCustomWorkout={isExerciseInCustomWorkout}
            addExercise={addExercise}
            removeExercise={removeExercise}
            setShowExerciseList={setShowExerciseList}
          />
        </Modal>
      )}
    </Container>
  );
};
export default WorkoutBuilder;

const Container = styled.section`
  display: flex;
  flex-direction: column;
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
