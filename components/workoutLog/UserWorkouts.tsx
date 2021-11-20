import { useState, useEffect } from "react";
import styled from "styled-components";
// Context
import { useUserState } from "../../store";
// API
import { getUserMadeWorkouts, getWorkoutsFromIdArray } from "../../api-lib/fetchers";
// Interfaces
import { Workout } from "../../types/interfaces";
import TiledList from "../Wrappers/TiledList";

interface Props {
  displayPremadeWorkout: (clicked: Workout) => Promise<void>;
}

const UserWorkouts: React.FC<Props> = ({ displayPremadeWorkout }) => {
  const { user, isSignedIn } = useUserState();

  const [createdWorkouts, setCreatedWorkouts] = useState<Workout[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const loadUserMadeWorkouts = async () => {
      const madeWorkouts = await getUserMadeWorkouts(user!._id);
      setCreatedWorkouts(madeWorkouts || []);
    };

    const loadUserSavedWorkouts = async () => {
      const savedWorkouts = await getWorkoutsFromIdArray(user!.savedWorkouts || []);
      setSavedWorkouts(savedWorkouts.reverse() || []);
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

        <TiledList
          items={createdWorkouts}
          onItemClick={(workout) => displayPremadeWorkout(workout)}
          displayProp={"name"}
          keyProp={"_id"}
        />
      </WorkoutsList>

      <WorkoutsList>
        <h3>Saved</h3>

        <TiledList
          items={savedWorkouts}
          onItemClick={(workout) => displayPremadeWorkout(workout)}
          displayProp={"name"}
          keyProp={"_id"}
        />
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
`;
