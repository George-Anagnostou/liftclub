import { useEffect, useState } from "react";
import styled from "styled-components";
// Utils
import { getUserMadeWorkouts, getWorkoutsFromIdArray } from "../../utils/ApiSupply";
// Context
import { useStoreState } from "../../store";
import DeleteWorkoutModul from "./DeleteWorkoutModul";

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
        <DeleteWorkoutModul
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
            style={customWorkout._id === workout._id ? { background: "rgb(215, 221, 247)" } : {}}
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
            style={customWorkout._id === workout._id ? { background: "rgb(215, 221, 247)" } : {}}
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
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  width: 15%;
  margin: 0.5rem 0;

  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  ul {
    width: 100%;

    li {
      border: none;
      border-radius: 5px;
      box-shadow: 0 0 5px grey;

      cursor: pointer;
      padding: 0.5rem;
      margin: 1rem;
      text-align: center;
      text-transform: capitalize;
      position: relative;

      &:hover {
        background: #c9c9c9;
      }

      button {
        position: absolute;
        top: 2px;
        right: 2px;
        height: 15px;
        width: 15px;
        font-size: 10px;
      }
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
  }
`;
