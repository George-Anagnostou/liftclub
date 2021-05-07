import { useEffect, useState } from "react";
import styled from "styled-components";
// Components
import LoadingSpinner from "../LoadingSpinner";
// Utils
import { getExercisesFromIdArray, getUserData } from "../../utils/ApiSupply";
import { timeSince } from "../../utils/general";

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
    const idArr = workout.exercises.map((each) => each.exercise_id);
    const exerciseData = await getExercisesFromIdArray(idArr);

    // Sort the array based on the order of the idArr
    exerciseData.sort((a, b) => idArr.indexOf(a._id) - idArr.indexOf(b._id));

    const clone = { ...workout };
    clone.exercises.map((each, i) => (each.exercise = exerciseData[i]));

    setWorkoutExercises(clone.exercises);
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
        <div>
          <h3>{workout.name}</h3>

          <p>
            Posted <span>{timeSince(new Date(workout.date_created))}</span>
          </p>
        </div>

        {loading && <LoadingSpinner />}

        <div>
          <button onClick={toggleWorkoutInfo}>{showWorkoutInfo ? "close" : "view"} info</button>
          {workoutIsSaved(workout) ? (
            <button className="remove" onClick={() => removeFromSavedWorkouts(workout)}>
              -
            </button>
          ) : (
            <button className="add" onClick={() => addToSavedWorkouts(workout)}>
              +
            </button>
          )}
        </div>
      </div>

      {showWorkoutInfo && creator && (
        <div className="workoutInfo">
          <p className="creator">
            By: <span>{creator}</span>
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
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;

  padding: 0.5rem;
  margin: 1rem;

  span {
    color: #515151;
  }

  .tile-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
      text-align: left;
      h3 {
        text-transform: capitalize;
      }

      p {
        font-size: 0.7rem;
        color: grey;
      }
    }

    button {
      cursor: pointer;
      border-radius: 5px;
      border: none;
      padding: 0.5rem;
      margin-left: 0.25rem;
      min-width: 40px;
      background: #d7d7d7;
    }

    .remove {
      background: #fdebdf;
    }
    .add {
      background: #eaeeff;
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
