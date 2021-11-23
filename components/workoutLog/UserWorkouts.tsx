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
    <>
      <WorkoutsList>
        <h3 className="section-title">My Workouts</h3>

        <TiledList
          items={createdWorkouts}
          onItemClick={(workout) => displayPremadeWorkout(workout)}
          displayProp={"name"}
          keyProp={"_id"}
        />
      </WorkoutsList>

      <WorkoutsList>
        <h3 className="section-title">Saved Workouts</h3>

        <TiledList
          items={savedWorkouts}
          onItemClick={(workout) => displayPremadeWorkout(workout)}
          displayProp={"name"}
          keyProp={"_id"}
        />
      </WorkoutsList>
    </>
  );
};
export default UserWorkouts;

const WorkoutsList = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;
`;
