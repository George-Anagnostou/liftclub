import { useEffect, useState } from "react";
import styled from "styled-components";
// Utils
import { getUserMadeWorkouts, getWorkoutsFromIdArray } from "../../../utils/api";
// Context
import { useStoreState } from "../../../store";
// Interfaces
import { Workout, Routine } from "../../../utils/interfaces";

interface Props {
  routine: Routine;
  setRoutine: React.Dispatch<React.SetStateAction<Routine>>;
  selectedDate: string;
  selectedWorkout: Workout | null;
}

const UserWorkouts: React.FC<Props> = ({ routine, setRoutine, selectedDate, selectedWorkout }) => {
  const { user } = useStoreState();

  const [userMadeWorkouts, setUserMadeWorkouts] = useState<Workout[]>([]);
  const [userSavedWorkouts, setUserSavedWorkouts] = useState<Workout[]>([]);

  const addWorkoutToRoutine = (workout: Workout) => {
    setRoutine((prev) => ({
      ...prev,
      workoutPlan: [
        ...prev.workoutPlan.filter((each) => each.isoDate !== selectedDate),
        { isoDate: selectedDate, workout_id: workout._id, workout },
      ].sort((a, b) => a.isoDate.localeCompare(b.isoDate)),
    }));
  };

  const removeWorkoutFromRoutine = () => {
    setRoutine((prev) => ({
      ...prev,
      workoutPlan: [
        ...prev.workoutPlan.filter((each) => each.isoDate.substring(0, 10) !== selectedDate),
      ],
    }));
  };

  const loadUserMadeWorkouts = async () => {
    const madeWorkouts = await getUserMadeWorkouts(user!._id);
    madeWorkouts.sort((a, b) => a.name.length - b.name.length);
    setUserMadeWorkouts(madeWorkouts);
  };

  const loadUserSavedWorkouts = async () => {
    if (!user?.savedWorkouts) return;
    const workouts = await getWorkoutsFromIdArray(user.savedWorkouts);
    setUserSavedWorkouts(workouts.reverse());
  };

  useEffect(() => {
    if (user) {
      // Get all workouts made by the user
      loadUserMadeWorkouts();
      // Get all workotus saved by the user
      loadUserSavedWorkouts();
    }
  }, [user]);

  const renderWorkoutItem = (workout: Workout, index: number) => {
    return (
      <li
        key={index}
        onClick={() => {
          if (selectedDate) {
            selectedWorkout?._id === workout._id
              ? removeWorkoutFromRoutine()
              : addWorkoutToRoutine(workout);
          }
        }}
        className={selectedWorkout?._id === workout._id ? "highlight" : ""}
      >
        {workout.name}
      </li>
    );
  };

  return (
    <Container>
      <WorkoutsList>
        <h3>Created</h3>

        <ul>
          {Boolean(userMadeWorkouts.length) ? (
            userMadeWorkouts.map((workout, i) => renderWorkoutItem(workout, i))
          ) : (
            <p className="fallbackText">None</p>
          )}
        </ul>
      </WorkoutsList>

      <WorkoutsList>
        <h3>Saved</h3>
        <ul>
          {Boolean(userSavedWorkouts.length) ? (
            userSavedWorkouts.map((workout, i) => renderWorkoutItem(workout, i))
          ) : (
            <p className="fallbackText">None</p>
          )}
        </ul>
      </WorkoutsList>
    </Container>
  );
};
export default UserWorkouts;

const Container = styled.div`
  width: calc(100vw - 1rem);
  margin-bottom: 0.5rem;
`;

const WorkoutsList = styled.div`
  width: 100%;
  border-radius: 5px;
  background: ${({ theme }) => theme.background};
  margin-bottom: 0.5rem;

  h3 {
    color: ${({ theme }) => theme.textLight};
    text-align: left;
    font-weight: 300;
    margin: 0.5rem;
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      position: relative;
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
      border-radius: 5px;
      cursor: pointer;
      padding: 0.5rem 1rem;
      margin: 0 0.25rem 0.5rem;
      word-wrap: break-word;
      text-align: left;

      &.highlight {
        background: ${({ theme }) => theme.accentSoft};
        color: ${({ theme }) => theme.accentText};
      }
    }
  }

  .fallbackText {
    width: fit-content;
    padding: 0 0.75rem 0.5rem;
    color: ${({ theme }) => theme.textLight};
  }
`;
