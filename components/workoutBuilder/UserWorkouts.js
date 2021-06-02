import { useEffect, useState } from "react";
import styled from "styled-components";
// Utils
import { getUserMadeWorkouts, getWorkoutsFromIdArray } from "../../utils/api";
// Context
import { useStoreState } from "../../store";
import DeleteWorkoutModal from "./DeleteWorkoutModal";
import { addExerciseDataToWorkout } from "../../utils";

export default function UserWorkouts({
  setCustomWorkout,
  customWorkout,
  workoutSavedSuccessfuly,
  clearCustomWorkout,
}) {
  const { user } = useStoreState();

  const [userMadeWorkouts, setUserMadeWorkouts] = useState([]);
  const [userSavedWorkouts, setUserSavedWorkouts] = useState([]);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  const displaySavedWorkout = async (workout) => {
    const mergedData = await addExerciseDataToWorkout(workout);
    setCustomWorkout(mergedData);
  };

  const loadUserMadeWorkouts = async () => {
    const madeWorkouts = await getUserMadeWorkouts(user._id);
    setUserMadeWorkouts(madeWorkouts);
  };

  const loadUserSavedWorkouts = async () => {
    const workouts = await getWorkoutsFromIdArray(user.savedWorkouts);
    // Sort the array based on the order of the user.savedWorkouts
    workouts.sort((a, b) => user.savedWorkouts.indexOf(a._id) - user.savedWorkouts.indexOf(b._id));
    setUserSavedWorkouts(workouts);
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
    <UserWorkoutsContainer>
      {workoutToDelete && (
        <DeleteWorkoutModal
          workout={workoutToDelete}
          setWorkoutToDelete={setWorkoutToDelete}
          clearCustomWorkout={clearCustomWorkout}
        />
      )}

      <ul>
        <h3>Created</h3>
        {Boolean(userMadeWorkouts.length) &&
          userMadeWorkouts.map((workout, i) => (
            <li
              key={i}
              onClick={() => displaySavedWorkout(workout)}
              className={customWorkout._id === workout._id ? "highlight" : ""}
            >
              {workout.name}

              <button onClick={() => setWorkoutToDelete(workout)}>X</button>
            </li>
          ))}
      </ul>

      <ul>
        <h3>Saved</h3>
        {Boolean(userSavedWorkouts.length) &&
          userSavedWorkouts.map((workout, i) => (
            <li
              key={i}
              onClick={() => displaySavedWorkout(workout)}
              className={customWorkout._id === workout._id ? "highlight" : ""}
            >
              {workout.name}
            </li>
          ))}
      </ul>
    </UserWorkoutsContainer>
  );
}

const UserWorkoutsContainer = styled.div`
  text-align: center;
  border: none;
  width: 100%;
  margin-bottom: 0.5rem;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;

  /* position: absolute;
  top: 100px; */

  ul {
    width: 100%;
    border-radius: 5px;
    padding-top: 0.5rem;
    background: ${({ theme }) => theme.buttonMed};

    &:first-child {
      margin-right: 0.5rem;
    }

    h3 {
      font-size: 4.4vw;
      color: ${({ theme }) => theme.textLight};
      font-weight: 100;
    }

    li {
      background: ${({ theme }) => theme.buttonLight};
      box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;

      cursor: pointer;
      padding: 0.5rem;
      margin: 1rem;
      text-align: center;
      text-transform: capitalize;
      position: relative;

      button {
        background: ${({ theme }) => theme.buttonMed};
        color: ${({ theme }) => theme.textLight};
        border: none;
        border-radius: 3px;
        position: absolute;
        top: 2px;
        right: 2px;
        height: 15px;
        width: 15px;
        font-size: 10px;
      }

      &.highlight {
        background: ${({ theme }) => theme.accentSoft};
      }
    }
  }
`;
