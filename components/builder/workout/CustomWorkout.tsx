import { useEffect } from "react";
import styled from "styled-components";
//Utils
import { postNewWorkout, updateExistingWorkout } from "../../../utils/api";
import { Exercise, User, Workout } from "../../../utils/interfaces";
// Components
import Checkmark from "../../Checkmark";
import CustoWorkoutExercise from "./CustomWorkoutExercise";

interface Props {
  customWorkout: Workout;
  setCustomWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  workoutSavedSuccessfuly: boolean | null;
  setWorkoutSavedSuccessfuly: React.Dispatch<React.SetStateAction<boolean | null>>;
  clearCustomWorkout: () => void;
  removeExercise: (exercise: Exercise) => void;
  user: User | undefined;
  setShowExerciseList: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomWorkout: React.FC<Props> = ({
  customWorkout,
  setCustomWorkout,
  workoutSavedSuccessfuly,
  setWorkoutSavedSuccessfuly,
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
    const num = Number(e.target.value);

    const { exercises } = customWorkout;

    exercises[exerciseIndex].sets[setIndex].reps = num;

    setCustomWorkout((prev) => {
      return { ...prev, exercises: exercises };
    });
  };

  const handleSetChange = (method: "add" | "remove", exerciseIndex: number) => {
    const { exercises } = customWorkout;

    switch (method) {
      case "add":
        // Add empty set to spedified exercise
        exercises[exerciseIndex].sets.push({ reps: 0, weight: -1 });
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
      setWorkoutSavedSuccessfuly(saveStatus);
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
      setWorkoutSavedSuccessfuly(saveStatus);
    }

    clearCustomWorkout();
  };

  // Remove saved successfully notification after 5 seconds
  useEffect(() => {
    if (workoutSavedSuccessfuly) setTimeout(() => setWorkoutSavedSuccessfuly(null), 3000);
  }, [workoutSavedSuccessfuly]);

  return (
    <CustomWorkoutContainer>
      <header>
        <div className="wrapper">
          <input
            type="text"
            name="workoutName"
            value={customWorkout.name}
            onChange={handleWorkoutNameChange}
            placeholder="Name your workout"
          />

          {workoutSavedSuccessfuly && (
            <Checkmark styles={{ position: "absolute", right: "1.4rem" }} />
          )}
        </div>

        {Boolean(customWorkout.exercises.length) && (
          <div className="controls">
            <button onClick={saveCustomWorkout}>Save</button>

            <button onClick={clearCustomWorkout}>Clear</button>

            {user?.isTrainer && (
              <div className="checkbox" onClick={handlePrivacyChange}>
                <label htmlFor="public">Public</label>
                <input
                  type="checkbox"
                  name="public"
                  checked={customWorkout.isPublic}
                  readOnly={true}
                />
              </div>
            )}
          </div>
        )}
      </header>

      {customWorkout.exercises.map(
        ({ exercise, sets }, i) =>
          exercise && (
            <CustoWorkoutExercise
              i={i}
              sets={sets}
              exercise={exercise}
              handleSetChange={handleSetChange}
              handleRepChange={handleRepChange}
              removeExercise={removeExercise}
            />
          )
      )}

      <FallbackText onClick={() => setShowExerciseList(true)}>
        <p>Add an exercise</p>
      </FallbackText>
    </CustomWorkoutContainer>
  );
};
export default CustomWorkout;

const CustomWorkoutContainer = styled.ul`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    background: ${({ theme }) => theme.buttonMed};
    border-radius: 5px;
    width: 100%;
    padding: 0.5rem;

    .wrapper {
      border-radius: 5px;
      width: 100%;
      background: ${({ theme }) => theme.background};

      display: flex;
      align-items: center;

      input[type="text"] {
        width: 100%;
        padding: 0.5rem;
        font-size: 1.1rem;
        border: none;
        border-radius: 5px;
        color: ${({ theme }) => theme.text};
        background: inherit;
      }
    }

    .controls {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      width: 100%;

      button {
        border: none;
        border-radius: 5px;
        background: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.text};
        box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
        display: inline-block;
        margin: 0.5rem;
        padding: 0.5rem 1rem;
        font-size: 1.1rem;
      }

      .checkbox {
        border: none;
        border-radius: 5px;
        background: ${({ theme }) => theme.background};
        color: ${({ theme }) => theme.text};
        box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
        display: inline-block;
        margin: 0.5rem;
        padding: 0.5rem 1rem;
        font-size: 1.1rem;

        input[type="checkbox"] {
          margin: 0 0.5rem;
          transform: scale(1.5);
          border: none;
          box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
        }
      }
    }
  }
`;

const FallbackText = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.textLight};
  box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};

  border-radius: 5px;
  margin: 1rem;
  padding: 1rem 2rem;
`;