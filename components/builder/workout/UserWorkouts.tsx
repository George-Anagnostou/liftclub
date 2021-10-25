import { useEffect, useState } from "react";
import styled from "styled-components";
// Utils
import { addExerciseDataToWorkout } from "../../../utils";
// Context
import { useBuilderDispatch, useBuilderState, useUserState } from "../../../store";
import {
  getUserCreatedWorkouts,
  getUserSavedWorkouts,
} from "../../../store/actions/builderActions";
// Interfaces
import { Workout } from "../../../utils/interfaces";
// Components
import DeleteWorkoutModal from "./DeleteWorkoutModal";

interface Props {
  setCustomWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  customWorkout: Workout;
  clearCustomWorkout: () => void;
}

const UserWorkouts: React.FC<Props> = ({ setCustomWorkout, customWorkout, clearCustomWorkout }) => {
  const { user } = useUserState();
  const { workouts } = useBuilderState();
  const builderDispatch = useBuilderDispatch();

  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);

  const displayWorkout = async (workout: Workout) => {
    const mergedData = await addExerciseDataToWorkout(workout);

    if (mergedData.creator_id !== user!._id) {
      mergedData.numLogged = 0;
      mergedData.isPublic = false;
    }

    setCustomWorkout(mergedData);
  };

  useEffect(() => {
    if (user) {
      if (!workouts.created) getUserCreatedWorkouts(builderDispatch, user._id);
      if (!workouts.saved) getUserSavedWorkouts(builderDispatch, user.savedWorkouts || []);
    }
  }, [workouts, user]);

  return (
    <Container>
      {workoutToDelete && (
        <DeleteWorkoutModal
          workout={workoutToDelete}
          setWorkoutToDelete={setWorkoutToDelete}
          clearCustomWorkout={clearCustomWorkout}
        />
      )}

      <WorkoutsList>
        <h3>Created</h3>

        <ul>
          {Boolean(workouts.created?.length) ? (
            workouts.created!.map((workout, i) => (
              <li
                key={i}
                onClick={() => displayWorkout(workout)}
                className={customWorkout._id === workout._id ? "highlight" : ""}
              >
                {workout.name}
                <button onClick={() => setWorkoutToDelete(workout)}>X</button>
              </li>
            ))
          ) : (
            <p className="fallbackText">None</p>
          )}
        </ul>
      </WorkoutsList>

      <WorkoutsList>
        <h3>Saved</h3>
        <ul>
          {Boolean(workouts.saved?.length) ? (
            workouts.saved!.map((workout, i) => (
              <li
                key={i}
                onClick={() => displayWorkout(workout)}
                className={customWorkout._id === workout._id ? "highlight" : ""}
              >
                {workout.name}
              </li>
            ))
          ) : (
            <p className="fallbackText">None</p>
          )}
        </ul>
      </WorkoutsList>
    </Container>
  );
};
export default UserWorkouts;

const Container = styled.div`
  width: calc(100vw - 1rem);
  margin-bottom: 0.5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WorkoutsList = styled.div`
  width: 100%;
  border-radius: 5px;
  background: ${({ theme }) => theme.background};
  margin-bottom: 0.5rem;

  h3 {
    text-align: left;
    padding-left: 0.75rem;
    margin: 0.25rem 0;
    font-size: 1rem;
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      margin: 0 0.25rem 0.5rem;
      word-wrap: break-word;
      text-align: left;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      font-weight: 300;

      button {
        font-size: 0.7rem;
        font-weight: 600;
        background: ${({ theme }) => theme.buttonLight};
        color: ${({ theme }) => theme.textLight};
        border: none;
        border-radius: 3px;
        margin-left: 0.3rem;
        height: 20px;
        min-width: 20px;
        transition: all 0.25s ease;
      }

      &.highlight {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accentText};

        button {
          background: ${({ theme }) => theme.accent};
          color: ${({ theme }) => theme.accentText};
        }
      }
    }
  }

  .fallbackText {
    width: fit-content;
    padding: 0 0.75rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
