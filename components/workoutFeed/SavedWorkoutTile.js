import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
// Components
import LoadingSpinner from "../LoadingSpinner";
// Utils
import { getUserData } from "../../utils/api";
import { addExerciseDataToWorkout, timeSince } from "../../utils";

export default function SavedWorkoutTile({ workout, removeFromSavedWorkouts }) {
  const [showWorkoutInfo, setShowWorkoutInfo] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [creator, setCreator] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleWorkoutView = () => setShowWorkoutInfo((prev) => !prev);

  // Get all exercises for a workout
  const getWorkoutExercises = async () => {
    const mergedData = await addExerciseDataToWorkout(workout);
    setWorkoutExercises(mergedData.exercises);
  };

  // Get creator username
  const getCreator = async () => {
    const creatorData = await getUserData(workout.creator_id);
    setCreator(creatorData.username);

    setLoading(false);
  };

  useEffect(() => {
    // Only fetch data if it has not already been fetched
    if (showWorkoutInfo && !workoutExercises.length) {
      setLoading(true);
      getWorkoutExercises();
      getCreator();
    }
  }, [showWorkoutInfo]);

  return (
    <WorkoutTile>
      <div className="tile-bar">
        <div className="name" onClick={toggleWorkoutView}>
          <h3>{workout.name}</h3>

          <p>
            Posted <span>{timeSince(new Date(workout.date_created))}</span>
          </p>
        </div>

        <div className="buttons">
          {loading && <LoadingSpinner />}

          <button className="remove" onClick={() => removeFromSavedWorkouts(workout)}>
            saved
          </button>

          <button onClick={toggleWorkoutView}>{showWorkoutInfo ? "close" : "view"}</button>
        </div>
      </div>

      {showWorkoutInfo && creator && (
        <div className="workoutInfo">
          <p className="creator">
            <Link href={`users/${workout.creator_id}`}>
              <a>
                By: <span>{creator}</span>
              </a>
            </Link>
          </p>

          {workoutExercises.map(({ sets, exercise_id, exercise }) => (
            <div key={`saved${exercise_id}`} className="exercise">
              {exercise && (
                <>
                  <p>{exercise.name}</p>
                  <p>{sets.length} sets</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </WorkoutTile>
  );
}

const WorkoutTile = styled.li`
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 2px 2px ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.background};

  padding: 0.5rem;
  margin: 0.5em;

  .tile-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .name {
      text-align: left;
      flex: 3;
      h3 {
        text-transform: capitalize;
      }

      p {
        font-size: 0.7rem;
        color: ${({ theme }) => theme.textLight};
      }
    }
    .loadingSpinner {
      margin-right: 0;
    }
    .buttons {
      width: 155px;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      button {
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
        color: ${({ theme }) => theme.accentText};
        background: ${({ theme }) => theme.accentSoft};
      }
    }
  }

  .workoutInfo {
    margin-top: 0.5rem;
    text-align: left;
    transform-origin: top;
    -webkit-animation: open 0.5s ease forwards; /* Safari */
    animation: open 0.5s ease forwards;

    .creator {
      font-size: 0.7rem;
      color: ${({ theme }) => theme.textLight};

      &:hover {
        text-decoration: underline;
        cursor: pointer;

        color: ${({ theme }) => theme.textLight};
      }
    }
    .exercise {
      margin: 0.25rem 0.5rem;
      text-transform: capitalize;
      display: flex;
      justify-content: space-between;
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
