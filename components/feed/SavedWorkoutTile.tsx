import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
// Components
import LoadingSpinner from "../LoadingSpinner";
// Utils
import { addExerciseDataToWorkout, timeSince } from "../../utils";
// Interfaces
import { Workout } from "../../utils/interfaces";

interface Props {
  workout: Workout;
  removeFromSavedWorkouts: (workout: Workout) => void;
}

const SavedWorkoutTile: React.FC<Props> = ({ workout, removeFromSavedWorkouts }) => {
  const tile = useRef<any>();

  const [workoutExercises, setWorkoutExercises] = useState<Workout["exercises"]>([]);
  const [showWorkoutInfo, setShowWorkoutInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [closedHeight, setClosedHeight] = useState<number>();
  const [openHeight, setOpenHeight] = useState<number>();

  const toggleWorkoutView = () => setShowWorkoutInfo((prev) => !prev);

  // Get all exercises for a workout
  const getWorkoutExercises = async () => {
    const mergedData = await addExerciseDataToWorkout(workout);
    setWorkoutExercises(mergedData.exercises);
    setLoading(false);
  };

  useEffect(() => {
    // Only fetch data if it has not already been fetched
    if (showWorkoutInfo && !workoutExercises.length) {
      setLoading(true);
      getWorkoutExercises();
    }
  }, [showWorkoutInfo]);

  useEffect(() => {
    if (!closedHeight) {
      setClosedHeight(tile.current.clientHeight);
    }
    if (!openHeight && showWorkoutInfo && !loading && tile.current.scrollHeight !== closedHeight) {
      setOpenHeight(tile.current.scrollHeight + workoutExercises.length * 10);
    }
  }, [tile, showWorkoutInfo, loading]);

  return (
    <WorkoutTile
      ref={tile}
      style={showWorkoutInfo && openHeight ? { height: openHeight } : { height: closedHeight }}
    >
      <div className="tile-bar">
        <div className="name">
          <h3 onClick={toggleWorkoutView}>{workout.name}</h3>

          <p>
            Posted <span>{timeSince(new Date(workout.date_created))}</span> by{" "}
            <Link href={`users/${workout.creatorName}`}>
              <a className="creator">{workout.creatorName}</a>
            </Link>
          </p>
        </div>

        <div className="buttons">
          {loading && <LoadingSpinner />}

          <button className="remove" onClick={() => removeFromSavedWorkouts(workout)}>
            saved
          </button>
        </div>
      </div>

      {showWorkoutInfo && !loading && (
        <ul className="workoutInfo">
          {workoutExercises.map(({ sets, exercise_id, exercise }) => (
            <li key={`saved${exercise_id}`} className="exercise">
              {exercise && (
                <>
                  <p>{exercise.name}</p>
                  <p className="sets">{sets.length} sets</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </WorkoutTile>
  );
};
export default SavedWorkoutTile;

const WorkoutTile = styled.li`
  border-radius: 10px;
  box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.background};

  padding: 0.5rem;
  margin: 0.5em;

  transition: height 0.25s ease-out;

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
        margin-top: 0.5rem;
        opacity: 0;
        transform: rotate3d(1, 0, 0, 45deg);
      }
      100% {
        margin-top: 0.5rem;
        opacity: 1;
        transform: rotate3d(0);
      }
    }

    @keyframes open {
      0% {
        margin-top: 0.5rem;
        opacity: 0;
        transform: rotate3d(1, 0, 0, 45deg);
      }
      100% {
        margin-top: 0.5rem;
        opacity: 1;
        transform: rotate3d(0);
      }
    }
  }
`;
