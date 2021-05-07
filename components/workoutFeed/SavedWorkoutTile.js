import { useEffect, useState } from "react";
import styled from "styled-components";
import { getExercisesFromIdArray } from "../../utils/ApiSupply";
import { timeSince } from "../../utils/general";

export default function SavedWorkoutTile({ workout, removeFromSavedWorkouts }) {
  const [showWorkoutInfo, setShowWorkoutInfo] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState([]);

  const toggleWorkoutView = () => {
    setShowWorkoutInfo((prev) => !prev);
  };

  const getWorkoutInfo = async () => {
    const idArr = workout.exercises.map((each) => each.exercise_id);
    const exerciseData = await getExercisesFromIdArray(idArr);

    // Sort the array based on the order of the idArr
    exerciseData.sort((a, b) => idArr.indexOf(a._id) - idArr.indexOf(b._id));

    const clone = { ...workout };
    clone.exercises.map((each, i) => (each.exercise = exerciseData[i]));

    setWorkoutExercises(clone.exercises);
  };

  useEffect(() => {
    if (showWorkoutInfo) getWorkoutInfo();
  }, [showWorkoutInfo]);
  return (
    <WorkoutTile  className="workout">
      <div>
        <button onClick={toggleWorkoutView}>View</button>

        <p>
          {workout.name} {timeSince(new Date(workout.date_created))}
        </p>

        <button className="remove" onClick={() => removeFromSavedWorkouts(workout)}>
          -
        </button>
      </div>

      {showWorkoutInfo &&
        workoutExercises.map(({ sets, exercise_id, exercise }) => (
          <div key={`saved${exercise_id}`} className="exercise">
            {exercise && (
              <>
                <p>{exercise?.name}</p> <p>{sets.length} sets</p>
              </>
            )}
          </div>
        ))}
    </WorkoutTile>
  );
}

const WorkoutTile = styled.li`
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;

  padding: 0.5rem;
  margin: 1rem;
  text-transform: capitalize;
  position: relative;

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      cursor: pointer;
      border-radius: 5px;
      border: none;
      padding: 0.5rem;

      min-width: 40px;
    }

    .remove {
      background: #fdebdf;
    }
  }
  .exercise {
  }
`;
