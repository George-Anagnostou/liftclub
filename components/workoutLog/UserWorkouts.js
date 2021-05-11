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
        <div>
          <h3>Saved Workouts</h3>
          <ul>
            {userSavedWorkouts.map((workout) => (
              <li key={workout._id} onClick={() => displayWorkout(workout)}>
                <h4>{workout.name}</h4>
                <p>{workout.exercises.length} exercises</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {Boolean(userMadeWorkouts.length) && (
        <div>
          <h3>Your Workouts</h3>
          <ul>
            {userMadeWorkouts.map((workout) => (
              <li key={workout._id} onClick={() => displayWorkout(workout)}>
                <h4>{workout.name}</h4>
                <p>{workout.exercises.length} exercises</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </UserWorkoutsContainer>
  );
}

const UserWorkoutsContainer = styled.div`
  width: 98%;
  border: none;
  border-radius: 5px;
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  div {
    flex: 1;
    ul {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;

      li {
        word-wrap: break-word;
        width: 100%;
        cursor: pointer;
        margin: 0.5rem;
        padding: 0.5rem;
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
  }
`;
