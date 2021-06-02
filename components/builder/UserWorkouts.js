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
  showUserWorkouts,
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
    <>
      {showUserWorkouts && (
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
              <p>None</p>
            )}
          </ul>

          <ul>
            <h3>Saved</h3>
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
              <p>None</p>
            )}
          </ul>
        </UserWorkoutsContainer>
      )}
    </>
  );
}

const UserWorkoutsContainer = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  animation: 0.35s ease-out forwards slidein;

  @keyframes slidein {
    from {
      margin-left: -100vw;
    }

    to {
      margin-left: 0%;
    }
  }

  ul {
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: scroll;
    width: 100%;
    border-radius: 5px;
    padding-top: 0.5rem;
    background: ${({ theme }) => theme.buttonMed};

    &:first-child {
      margin-right: 0.5rem;
    }

    h3 {
      font-size: 1.1rem;
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

    p {
      padding: 0.5rem;
    }
  }
`;
