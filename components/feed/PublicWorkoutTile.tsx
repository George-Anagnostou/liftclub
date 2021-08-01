import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
// Components
import LoadingSpinner from "../LoadingSpinner";
// Utils
import { addExerciseDataToWorkout, timeSince } from "../../utils";
// Interfaces
import { Workout } from "../../utils/interfaces";
// Context
import { useStoreState } from "../../store";

interface Props {
  workout: Workout;
  removeFromSavedWorkouts: (workout: Workout) => void;
  addToSavedWorkouts: (workout: Workout) => void;
}

const PublicWorkoutTile: React.FC<Props> = ({
  workout,
  removeFromSavedWorkouts,
  addToSavedWorkouts,
}) => {
  const { user } = useStoreState();

  const [workoutExercises, setWorkoutExercises] = useState<Workout["exercises"]>([]);
  const [showWorkoutInfo, setShowWorkoutInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleWorkoutInfo = () => setShowWorkoutInfo((prev) => !prev);

  // Returns boolean for if a workout is in savedWorkouts
  const workoutIsSaved = (workout: Workout) => {
    if (user?.savedWorkouts && user?.savedWorkouts?.indexOf(workout._id) > -1) {
      return true;
    } else return false;
  };

  // Get all exercises for a workout
  const getWorkoutExercises = async () => {
    const { exercises } = await addExerciseDataToWorkout(workout);
    setWorkoutExercises(exercises);
    setLoading(false);
  };

  useEffect(() => {
    // Only fetch data if it has not already been fetched
    if (showWorkoutInfo && !workoutExercises.length) {
      setLoading(true);
      getWorkoutExercises();
    }
  }, [showWorkoutInfo]);

  return (
    <WorkoutTile>
      <div className="tile-bar">
        <div className="name">
          <h3 onClick={toggleWorkoutInfo}>{workout.name}</h3>

          <p>
            Posted <span>{timeSince(new Date(workout.date_created))}</span> by{" "}
            <Link href={`users/${workout.creatorName}`}>
              <a className="creator">{workout.creatorName}</a>
            </Link>
          </p>
        </div>

        <div className="buttons">
          {loading && <LoadingSpinner />}

          {workoutIsSaved(workout) ? (
            <button className="remove" onClick={() => removeFromSavedWorkouts(workout)}>
              saved
            </button>
          ) : (
            <button className="add" onClick={() => addToSavedWorkouts(workout)}>
              save
            </button>
          )}
        </div>
      </div>

      {showWorkoutInfo && (
        <div className="workoutInfo">
          {workoutExercises.map(({ sets, exercise_id, exercise }) => (
            <div key={`public${exercise_id}`} className="exercise">
              {exercise && (
                <>
                  <p>{exercise.name}</p>
                  <p className="sets">{sets.length} sets</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </WorkoutTile>
  );
};
export default PublicWorkoutTile;

const WorkoutTile = styled.li`
  border-radius: 10px;
  box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.background};

  padding: 0.5rem;
  margin: 0.75em 0.5rem;

  .tile-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .name {
      text-align: left;
      flex: 3;

      h3 {
        font-weight: 300;
        text-transform: capitalize;
      }

      p {
        font-size: 0.65rem;
        color: ${({ theme }) => theme.textLight};

        .creator {
          color: ${({ theme }) => theme.text};
          font-size: 1.05em;

          &:hover {
            text-decoration: underline;
            cursor: pointer;

            color: ${({ theme }) => theme.textLight};
          }
        }
      }
    }
    .loadingSpinner {
      margin-right: 0;
    }
    .buttons {
      width: min-content;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      button {
        font-size: 0.6rem;
        cursor: pointer;
        border-radius: 5px;
        border: none;
        padding: 0.5rem;
        margin-left: 0.5rem;
        min-width: 40px;
        background: ${({ theme }) => theme.buttonLight};
        color: ${({ theme }) => theme.text};
      }

      .remove {
        color: ${({ theme }) => theme.textLight};
        background: ${({ theme }) => theme.buttonMed};
      }
      .add {
        color: ${({ theme }) => theme.accentText};
        background: ${({ theme }) => theme.accent};
      }

      @media (max-width: 350px) {
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;

        button {
          margin: 0.25rem 0;
        }
      }
    }
  }

  .workoutInfo {
    margin-top: 0.5rem;
    text-align: left;
    transform-origin: top;
    -webkit-animation: open 0.5s ease forwards; /* Safari */
    animation: open 0.5s ease forwards;

    .exercise {
      margin: 0.25rem 0.5rem;
      text-transform: capitalize;
      display: flex;
      justify-content: space-between;

      .sets {
        min-width: max-content;
      }
    }

    /* Safari */
    @-webkit-keyframes open {
      0% {
        opacity: 0;
        transform: rotate3d(1, 0, 0, 45deg);
      }
      100% {
        opacity: 1;
        transform: rotate3d(0);
      }
    }

    @keyframes open {
      0% {
        opacity: 0;
        transform: rotate3d(1, 0, 0, 45deg);
      }
      100% {
        opacity: 1;
        transform: rotate3d(0);
      }
    }
  }
`;
