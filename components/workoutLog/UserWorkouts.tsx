import { useState, useEffect } from "react";
import styled from "styled-components";
// Context
import { useUserState } from "../../store";
// API
import { getUserMadeWorkouts, getWorkoutsFromIdArray } from "../../utils/api";
// Interfaces
import { Workout } from "../../utils/interfaces";

interface Props {
  displayWorkout: (clicked: Workout) => Promise<void>;
}

const UserWorkouts: React.FC<Props> = ({ displayWorkout }) => {
  const { user, isSignedIn } = useUserState();

  const [userMadeWorkouts, setUserMadeWorkouts] = useState<Workout[]>([]);
  const [userSavedWorkouts, setUserSavedWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const loadUserMadeWorkouts = async () => {
      const madeWorkouts = await getUserMadeWorkouts(user!._id);
      setUserMadeWorkouts(madeWorkouts || []);
    };

    const loadUserSavedWorkouts = async () => {
      const savedWorkouts = await getWorkoutsFromIdArray(user!.savedWorkouts || []);
      setUserSavedWorkouts(savedWorkouts.reverse() || []);
    };

    // workoutLog is used to update DateScroll UI when saving or removing a workout
    if (isSignedIn && user) {
      // Get all workouts made by the user
      loadUserMadeWorkouts();
      // Get all workotus saved by the user
      loadUserSavedWorkouts();
    }
  }, [isSignedIn]);

  return (
    <Container>
      <WorkoutsList>
        <h3>Created</h3>

        {Boolean(userMadeWorkouts.length) ? (
          <ul>
            {userMadeWorkouts.map((workout) => (
              <li key={workout._id} onClick={() => displayWorkout(workout)}>
                {workout.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="fallbackText">None</p>
        )}
      </WorkoutsList>

      <WorkoutsList>
        <h3>Saved</h3>

        {Boolean(userSavedWorkouts.length) ? (
          <ul>
            {userSavedWorkouts.map((workout) => (
              <li key={workout._id} onClick={() => displayWorkout(workout)}>
                {workout.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="fallbackText">None</p>
        )}
      </WorkoutsList>
    </Container>
  );
};
export default UserWorkouts;

const Container = styled.section`
  width: 100%;
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
      font-weight: 300;
      position: relative;
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;
      cursor: pointer;
      padding: 0.25rem 1rem;
      margin: 0 0.25rem 0.5rem;
      word-wrap: break-word;
      text-align: left;
    }
  }

  .fallbackText {
    width: fit-content;
    padding: 0 0.75rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
