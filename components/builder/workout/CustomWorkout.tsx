import { useEffect } from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import update from "immutability-helper";
//Utils
import { postNewWorkout, updateExistingWorkout } from "../../../utils/api";
import { User, Workout } from "../../../utils/interfaces";
// Components
import CustomWorkoutExercise from "./CustomWorkoutExercise";
import CustomWorkoutControls from "./WorkoutControls";

interface Props {
  customWorkout: Workout;
  setCustomWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  workoutSavedSuccessfully: boolean | null;
  setWorkoutSavedSuccessfully: React.Dispatch<React.SetStateAction<boolean | null>>;
  clearCustomWorkout: () => void;
  removeExercise: (exercise_id: string) => void;
  user: User | undefined;
  setShowExerciseList: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomWorkout: React.FC<Props> = ({
  customWorkout,
  setCustomWorkout,
  workoutSavedSuccessfully,
  setWorkoutSavedSuccessfully,
  clearCustomWorkout,
  removeExercise,
  user,
  setShowExerciseList,
}) => {
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
    if (!user) return;

    const { exercises } = customWorkout;
    // Only take exercise_id and sets (exercise data not needed for DB)
    const composedExercises = exercises.map(({ exercise_id, sets }) => ({ exercise_id, sets }));

    const composedWorkout = {
      ...customWorkout,
      exercises: composedExercises,
    };

    if (composedWorkout.creator_id === user._id) {
      // Workout owner is editing existing workout

      const saveStatus = await updateExistingWorkout(composedWorkout);
      setWorkoutSavedSuccessfully(saveStatus);
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
      const { _id, ...rest } = composedWorkout;
      // Add date created
      rest.date_created = new Date().toISOString();

      const saveStatus = await postNewWorkout(rest);
      setWorkoutSavedSuccessfully(saveStatus);
    }

    clearCustomWorkout();
  };

  // Remove saved successfully notification after 5 seconds
  useEffect(() => {
    if (workoutSavedSuccessfully) setTimeout(() => setWorkoutSavedSuccessfully(null), 3000);
  }, [workoutSavedSuccessfully]);

  return (
    <>
      <CustomWorkoutControls
        customWorkout={customWorkout}
        handleWorkoutNameChange={handleWorkoutNameChange}
        workoutSavedSuccessfully={workoutSavedSuccessfully}
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

      <AddExerciseBtn onClick={() => setShowExerciseList(true)}>
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
  background: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.accentText};
  box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
  border: none;
  width: fit-content;
  margin: 1rem auto;
  padding: 0.5rem 1rem;

  border-radius: 5px;
  font-size: 1.1rem;
`;
