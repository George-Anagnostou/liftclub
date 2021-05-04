import { useEffect, useState } from "react";
import styled from "styled-components";
// Utils
import { getUserMadeWorkouts, getWorkoutsFromIdArray } from "../../utils/ApiSupply";
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
        <>
          <h3>Saved Workouts</h3>
          <ul>
            {userSavedWorkouts.map((workout) => (
              <li key={workout._id} onClick={() => displayWorkout(workout)}>
                <h4>{workout.name}</h4>
                <p>{workout.exercises.length} exercises</p>
              </li>
            ))}
          </ul>
        </>
      )}

      {Boolean(userMadeWorkouts.length) && (
        <>
          <h3>Your Workouts</h3>
          <ul>
            {userMadeWorkouts.map((workout) => (
              <li key={workout._id} onClick={() => displayWorkout(workout)}>
                <h4>{workout.name}</h4>
                <p>{workout.exercises.length} exercises</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </UserWorkoutsContainer>
  );
}

const UserWorkoutsContainer = styled.div`
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  max-width: 100%;
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;

  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    li {
      flex: 1;
      min-width: 90%;
      cursor: pointer;
      margin: 0.5rem;
      padding: 0.5rem 0.2rem;
      border-radius: 5px;
      box-shadow: 0 0 5px grey;

      &:hover {
        background: #ccc;
      }

      h4 {
        text-transform: capitalize;
        padding-bottom: 0.5rem;
      }
    }
  }

  @media (max-width: 500px) {
    width: 98%;
  }
`;
