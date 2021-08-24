import { useEffect, useState } from "react";
import styled from "styled-components";
// Utils
import { getUserMadeWorkouts, getWorkoutsFromIdArray } from "../../../utils/api";
import { addExerciseDataToWorkout } from "../../../utils";
// Context
import { useStoreState } from "../../../store";
import DeleteWorkoutModal from "./DeleteWorkoutModal";
// Utils
// Interfaces
import { Workout } from "../../../utils/interfaces";

interface Props {
  setCustomWorkout: React.Dispatch<React.SetStateAction<Workout>>;
  customWorkout: Workout;
  workoutSavedSuccessfully: boolean | null;
  clearCustomWorkout: () => void;
}

const UserWorkouts: React.FC<Props> = ({
  setCustomWorkout,
  customWorkout,
  workoutSavedSuccessfully,
  clearCustomWorkout,
}) => {
  const { user } = useStoreState();

  const [userMadeWorkouts, setUserMadeWorkouts] = useState<Workout[]>([]);
  const [userSavedWorkouts, setUserSavedWorkouts] = useState<Workout[]>([]);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);

  const displaySavedWorkout = async (workout: Workout) => {
    const mergedData = await addExerciseDataToWorkout(workout);
    setCustomWorkout(mergedData);
  };

  const loadUserMadeWorkouts = async () => {
    const madeWorkouts = await getUserMadeWorkouts(user!._id);
    madeWorkouts.sort((a, b) => a.name.length - b.name.length);
    setUserMadeWorkouts(madeWorkouts);
  };

  const loadUserSavedWorkouts = async () => {
    if (!user?.savedWorkouts) return;
    const workouts = await getWorkoutsFromIdArray(user.savedWorkouts);
    setUserSavedWorkouts(workouts.reverse());
  };

  useEffect(() => {
    if (user) {
      // Get all workouts made by the user
      loadUserMadeWorkouts();
      // Get all workotus saved by the user
      loadUserSavedWorkouts();
    }
  }, [user, workoutSavedSuccessfully, workoutToDelete]);

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
          {Boolean(userMadeWorkouts.length) ? (
            userMadeWorkouts.map((workout, i) => (
              <li
                key={i}
                onClick={() => displaySavedWorkout(workout)}
                className={customWorkout._id === workout._id ? "highlight" : ""}
              >
                {workout.name}

                <button onClick={() => setWorkoutToDelete(workout)}>x</button>
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
          {Boolean(userSavedWorkouts.length) ? (
            userSavedWorkouts.map((workout, i) => (
              <li
                key={i}
                onClick={() => displaySavedWorkout(workout)}
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
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    font-weight: 300;
    margin: 0.5rem;
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;
      cursor: pointer;
      padding: 0.5rem;
      margin: 0 0.25rem 0.5rem;
      word-wrap: break-word;
      text-align: left;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;

      button {
        font-size: 0.7rem;
        font-weight: 600;
        background: ${({ theme }) => theme.buttonLight};
        color: ${({ theme }) => theme.textLight};
        border: none;
        border-radius: 3px;
        margin-left: 0.3rem;
        height: 20px;
        width: 20px;
        padding: 0;
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
