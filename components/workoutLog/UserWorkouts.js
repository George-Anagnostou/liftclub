import { useEffect, useState } from "react";
import styled from "styled-components";
// Utils
import { getUserMadeWorkouts, getWorkoutsFromIdArray } from "../../utils/api";
// Context
import { useStoreState } from "../../store";

export default function UserWorkouts({ displayWorkout }) {
  const { user } = useStoreState();

  const [userMadeWorkouts, setUserMadeWorkouts] = useState([]);
  const [userSavedWorkouts, setUserSavedWorkouts] = useState([]);

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
  }, [user]);

  return (
    <UserWorkoutsContainer>
      {Boolean(userSavedWorkouts.length) && (
        <ul>
          <h3>Saved</h3>

          {userSavedWorkouts.map((workout) => (
            <li key={workout._id} onClick={() => displayWorkout(workout)}>
              <h4>{workout.name}</h4>
              <p>{workout.exercises.length} exercises</p>
            </li>
          ))}
        </ul>
      )}

      {Boolean(userMadeWorkouts.length) && (
        <ul>
          <h3>Created</h3>

          {userMadeWorkouts.map((workout) => (
            <li key={workout._id} onClick={() => displayWorkout(workout)}>
              <h4>{workout.name}</h4>
              <p>
                {workout.exercises.length} {workout.exercises.length > 1 ? "exercises" : "exercise"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </UserWorkoutsContainer>
  );
}

const UserWorkoutsContainer = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  ul {
    max-height: 400px;
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

      h4 {
        text-transform: capitalize;
        padding-bottom: 0.5rem;
      }
    }
  }
`;
