import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import update from "immutability-helper";
// Interfaces
import { User, Workout } from "../../../utils/interfaces";
// Components
import CustomWorkoutExercise from "./CustomWorkoutExercise";
import CustomWorkoutControls from "./WorkoutControls";
// Context
import { useBuilderDispatch } from "../../../store";
import {
  addWorkoutToCreatedWorkouts,
  updateExistingCreatedWorkout,
} from "../../../store/actions/builderActions";

interface Props {
  customWorkout: Workout;
  setCustomWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  clearCustomWorkout: () => void;
  removeExercise: (exercise_id: string) => void;
  user: User | undefined;
  setExerciseListBottom: React.Dispatch<React.SetStateAction<number>>;
}

const CustomWorkout: React.FC<Props> = ({
  customWorkout,
  setCustomWorkout,
  clearCustomWorkout,
  removeExercise,
  user,
  setExerciseListBottom,
}) => {
  const builderDispatch = useBuilderDispatch();

  // Handles changes for custom workout name
  const handleWorkoutNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomWorkout((prev) => {
      return { ...prev, name: e.target.value };
    });
  };

  const handlePrivacyChange = () => {
    setCustomWorkout((prev) => {
      return { ...prev, isPublic: !prev.isPublic };
    });
  };

  // Update the reps for specified set
  const handleRepChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    exerciseIndex: number,
    setIndex: number
  ) => {
    const num = Number(e.target.value || 0);

    setCustomWorkout(
      update(customWorkout, {
        exercises: { [exerciseIndex]: { sets: { [setIndex]: { reps: { $set: num } } } } },
      })
    );
  };

  const handleSetChange = (method: "add" | "remove", exerciseIndex: number) => {
    switch (method) {
      case "add":
        if (customWorkout.exercises[exerciseIndex].sets.length >= 100) break;

        // Add empty set to spedified exercise
        setCustomWorkout(
          update(customWorkout, {
            exercises: { [exerciseIndex]: { sets: { $push: [{ reps: 0, weight: -1 }] } } },
          })
        );
        break;
      case "remove":
        // Remove last set from spedified exercise
        setCustomWorkout(
          update(customWorkout, {
            exercises: {
              [exerciseIndex]: {
                sets: { $splice: [[customWorkout.exercises[exerciseIndex].sets.length - 1, 1]] },
              },
            },
          })
        );
        break;
      default:
        break;
    }
  };

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

  return (
    <>
      <CustomWorkoutControls
        customWorkout={customWorkout}
        handleWorkoutNameChange={handleWorkoutNameChange}
        saveCustomWorkout={saveCustomWorkout}
        clearCustomWorkout={clearCustomWorkout}
        handlePrivacyChange={handlePrivacyChange}
      />

      <Droppable droppableId={"workout"}>
        {(provided) => (
          <ExerciseList {...provided.droppableProps} ref={provided.innerRef}>
            {customWorkout.exercises.map(
              ({ exercise, sets }, i) =>
                exercise && (
                  <CustomWorkoutExercise
                    key={exercise._id}
                    exerciseIndex={i}
                    sets={sets}
                    exercise={exercise}
                    handleSetChange={handleSetChange}
                    handleRepChange={handleRepChange}
                    removeExercise={removeExercise}
                  />
                )
            )}
            {provided.placeholder}
          </ExerciseList>
        )}
      </Droppable>

      <AddExerciseBtn onClick={() => setExerciseListBottom(0)}>
        <p>Add Exercise</p>
      </AddExerciseBtn>
    </>
  );
};
export default CustomWorkout;

const ExerciseList = styled.ul`
  width: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  position: relative;
`;

const AddExerciseBtn = styled.button`
  background: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.accentText};
  box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
  border: none;
  width: fit-content;
  margin: 1rem auto;
  padding: 0.25rem 2rem;
  font-weight: 300;

  border-radius: 5px;
  font-size: 1.1rem;
`;
