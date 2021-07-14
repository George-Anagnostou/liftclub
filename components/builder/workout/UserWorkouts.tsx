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
  workoutSavedSuccessfuly: boolean | null;
  clearCustomWorkout: () => void;
  showUserWorkouts: boolean;
}

const UserWorkouts: React.FC<Props> = ({
  setCustomWorkout,
  customWorkout,
  workoutSavedSuccessfuly,
  clearCustomWorkout,
  showUserWorkouts,
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
    setUserMadeWorkouts(madeWorkouts || []);
  };

  const loadUserSavedWorkouts = async () => {
    if (!user?.savedWorkouts) return;
    const workouts = await getWorkoutsFromIdArray(user.savedWorkouts);
    setUserSavedWorkouts(workouts.reverse() || []);
  };

  useEffect(() => {
    if (user) {
      // Get all workouts made by the user
      loadUserMadeWorkouts();
      // Get all workotus saved by the user
      loadUserSavedWorkouts();
    }
  }, [user, workoutSavedSuccessfuly, workoutToDelete]);

  return (
    <>
      {showUserWorkouts && (
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
      )}
    </>
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
      position: relative;
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;
      cursor: pointer;
      padding: 0.5rem 1.2rem 0.5rem 1rem;
      margin: 0 0.5rem 0.5rem;
      min-width: max-content;

      p {
        text-transform: capitalize;
        width: max-content;
      }
    }

    @media (max-width: 425px) {
      /* Remove scroll bar on mobile */
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  button {
    background: ${({ theme }) => theme.buttonLight};
    color: ${({ theme }) => theme.textLight};
    border: none;
    border-radius: 3px;
    position: absolute;
    top: 2px;
    right: 2px;

    font-size: 8px;
    padding: 2px 4px;
  }

  &.highlight {
    background: ${({ theme }) => theme.accentSoft};
  }

  .fallbackText {
    width: fit-content;
    padding: 0 0.75rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
