import { useEffect } from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
//Utils
import { postNewWorkout, updateExistingWorkout } from "../../../utils/api";
import { Exercise, User, Workout } from "../../../utils/interfaces";
// Components
import CustomWorkoutExercise from "./CustomWorkoutExercise";
import CustomWorkoutControls from "./CustomWorkoutControls";

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
  // Handles changes for customWorkoutName
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

    setCustomWorkout((prev) => {
      prev.exercises[exerciseIndex].sets[setIndex].reps = num;
      return { ...prev };
    });
  };

  const handleSetChange = (method: "add" | "remove", exerciseIndex: number) => {
    setCustomWorkout((prev) => {
      switch (method) {
        case "add":
          // Add empty set to spedified exercise
          if (prev.exercises[exerciseIndex].sets.length >= 100) break;
          
          prev.exercises[exerciseIndex].sets.push({ reps: 0, weight: -1 });
          break;
        case "remove":
          // Remove last set from spedified exercise
          prev.exercises[exerciseIndex].sets.pop();
          break;
      }

      return { ...prev };
    });
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

      <FallbackText onClick={() => setShowExerciseList(true)}>
        <p>Add an exercise</p>
      </FallbackText>
    </>
  );
};
export default CustomWorkout;

const ExerciseList = styled.ul`
  width: 100%;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  position: relative;
`;

const FallbackText = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textLight};
  box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};

  border-radius: 5px;
  margin: 1rem;
  padding: 1rem 2rem;
`;
