import { useEffect, useState } from "react";
import styled from "styled-components";
// Utils
import { getUserMadeWorkouts, getWorkoutsFromIdArray } from "../../utils/api";
// Context
import { useStoreState } from "../../store";
import DeleteWorkoutModal from "./DeleteWorkoutModal";

export default function UserWorkouts({
  displaySavedWorkout,
  customWorkout,
  workoutSavedSuccessfuly,
  clearCustomWorkout,
}) {
  const { user } = useStoreState();

  const [userMadeWorkouts, setUserMadeWorkouts] = useState([]);
  const [userSavedWorkouts, setUserSavedWorkouts] = useState([]);
  const [workoutToDelete, setWorkoutToDelete] = useState(null);

  const loadUserMadeWorkouts = async () => {
    const madeWorkouts = await getUserMadeWorkouts(user._id);
    setUserMadeWorkouts(madeWorkouts);
  };

  const loadUserSavedWorkouts = async () => {
    const savedWorkouts = await getWorkoutsFromIdArray(user.savedWorkouts);
    setUserSavedWorkouts(savedWorkouts);
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
        <h3>Your Workouts</h3>
        {userMadeWorkouts.map((workout, i) => (
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
        <h3>Saved Workouts</h3>
        {userSavedWorkouts.map((workout, i) => (
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
  margin: 0.5rem 0;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  ul {
    width: 100%;

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
