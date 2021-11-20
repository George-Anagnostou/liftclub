import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
// Components
import ExerciseList from "./ExerciseList";
import UserWorkouts from "./UserWorkouts";
import CustomWorkout from "./CustomWorkout";
// Context
import { useBuilderDispatch, useUserState } from "../../../store";
// Interfaces
import { Exercise, Workout } from "../../../types/interfaces";
import { moveItemInArray } from "../../../utils";
import ControlsBar from "./ControlsBar";
import {
  addWorkoutToCreatedWorkouts,
  updateExistingCreatedWorkout,
} from "../../../store/actions/builderActions";
import styled from "styled-components";

const InitialCustomWorkout: Workout = {
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
  const { user } = useUserState();
  const builderDispatch = useBuilderDispatch();

  const [exerciseListBottom, setExerciseListBottom] = useState(-80); // number ranging from -80 to 0
  const [customWorkout, setCustomWorkout] = useState<Workout>(InitialCustomWorkout);

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
            { exercise: exercise, exercise_id: exercise._id, sets: [{ reps: 0, weight: -1 }] },
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
  const clearCustomWorkout = () => setCustomWorkout(InitialCustomWorkout);

  const saveCustomWorkout = async () => {
    if (!user) return false;

    const { exercises } = customWorkout;
    // Only take exercise_id and sets (exercise data not needed for DB)
    const composedExercises = exercises.map(({ exercise_id, sets }) => ({ exercise_id, sets }));

    const composedWorkout = {
      ...customWorkout,
      exercises: composedExercises,
    };
    let saveStatus: boolean = false;

    if (composedWorkout.creator_id === user._id) {
      // Workout owner is editing existing workout

      saveStatus = await updateExistingCreatedWorkout(builderDispatch, composedWorkout);
    } else {
      // User is saving their version of a saved workout or building a new workout

      composedWorkout.name = composedWorkout.name || "New Workout";
      // Set creator_id to user's _id
      composedWorkout.creator_id = user._id;
      // Set creatorName to user's username
      composedWorkout.creatorName = user.username;
      // Only allow admins to save public workouts
      if (!user.isTrainer) composedWorkout.isPublic = false;
      // Remove any existing _id
      const { _id, ...workout } = composedWorkout;
      // Add date created
      workout.date_created = new Date().toISOString();

      saveStatus = await addWorkoutToCreatedWorkouts(builderDispatch, workout);
    }

    return saveStatus;
  };

  // Handles changes for custom workout name
  const handleWorkoutNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomWorkout((prev) => {
      return { ...prev, name: e.target.value };
    });
  };

  // Handles changes for custom workout privacy
  const handlePrivacyChange = () => {
    setCustomWorkout((prev) => {
      return { ...prev, isPublic: !prev.isPublic };
    });
  };

  const handleDragDropEnd = (result: any) => {
    const startIndex: number = result.source?.index;
    const endIndex: number = result.destination?.index > -1 ? result.destination.index : startIndex;

    if (startIndex === endIndex) return;

    setCustomWorkout((prev) => ({
      ...prev,
      exercises: moveItemInArray(prev.exercises, startIndex, endIndex),
    }));
  };

  return (
    <>
      <ControlsBar
        customWorkout={customWorkout}
        handleWorkoutNameChange={handleWorkoutNameChange}
        saveCustomWorkout={saveCustomWorkout}
        clearCustomWorkout={clearCustomWorkout}
        handlePrivacyChange={handlePrivacyChange}
      />

      <DragDropContext onDragEnd={handleDragDropEnd}>
        <CustomWorkout
          customWorkout={customWorkout}
          setCustomWorkout={setCustomWorkout}
          removeExercise={removeExercise}
        />
      </DragDropContext>

      <AddExerciseBtn onClick={() => setExerciseListBottom((prev) => (prev === 0 ? -80 : 0))}>
        <p>
          Add Exercise <span>＋</span>
        </p>
      </AddExerciseBtn>

      <UserWorkouts
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
    </>
  );
};
export default WorkoutBuilder;

const AddExerciseBtn = styled.button`
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.accentText};
  box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
  border: none;
  width: fit-content;
  margin: 0.5rem auto 1rem;
  padding: 0.25rem 2rem;
  font-weight: 300;
  border-radius: 5px;
  font-size: 1.1rem;

  span {
    font-weight: 200;
  }
`;
