import { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
// Components
import LoadingSpinner from "../LoadingSpinner";
// Utils
import { getUserData } from "../../utils/api";
import { addExerciseDataToWorkout, timeSince } from "../../utils";

export default function PublicWorkoutTile({
  workout,
  workoutIsSaved,
  removeFromSavedWorkouts,
  addToSavedWorkouts,
}) {
  const [showWorkoutInfo, setShowWorkoutInfo] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [creator, setCreator] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleWorkoutInfo = () => {
    setShowWorkoutInfo((prev) => !prev);
  };

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
    if (showWorkoutInfo && !workoutExercises.length) {
      setLoading(true);
      getWorkoutExercises();
      getCreator();
    }
  }, [showWorkoutInfo]);

  return (
    <WorkoutTile>
      <div className="tile-heading">
        <div className="name">
          <h3>{workout.name}</h3>

          <p>
            Posted <span>{timeSince(new Date(workout.date_created))}</span>
          </p>
        </div>

        <div className="buttons">
          {loading && <LoadingSpinner />}

          {workoutIsSaved(workout) ? (
            <button className="remove" onClick={() => removeFromSavedWorkouts(workout)}>
              remove
            </button>
          ) : (
            <button className="add" onClick={() => addToSavedWorkouts(workout)}>
              save
            </button>
          )}
          <button onClick={toggleWorkoutInfo}>{showWorkoutInfo ? "close" : "view"}</button>
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
            <div key={`public${exercise_id}`} className="exercise">
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
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  box-shadow: 0 0 5px ${({ theme }) => theme.boxShadow};

  padding: 0.5rem;
  margin: 1rem;

  .tile-heading {
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
        color: grey;
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
        color: ${({ theme }) => theme.textLight};
        background: ${({ theme }) => theme.accentSoft};
      }
      .add {
        color: ${({ theme }) => theme.text};
        background: ${({ theme }) => theme.accent};
      }
    }
  }

  .workoutInfo {
    text-align: left;
    transform-origin: top;
    -webkit-animation: open 0.5s ease forwards; /* Safari */
    animation: open 0.5s ease forwards;

    .creator {
      font-size: 0.7rem;
      color: grey;

      &:hover {
        text-decoration: underline;
        cursor: pointer;

        color: ${({ theme }) => theme.textLight};
      }
    }
    .exercise {
      margin: 0.25rem 0;
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
