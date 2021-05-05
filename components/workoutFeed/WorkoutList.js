import styled from "styled-components";

export default function WorkoutList({
  section,
  workouts,
  toggleWorkoutView,
  workoutIsSaved,
  removeFromSavedWorkouts,
  addToSavedWorkouts,
  workoutIsInViewMode,
}) {
  return (
    <WorkoutsListContainer>
      <h3>{section} Workouts</h3>

      {workouts.map((workout, i) => (
        <li key={`${section} ${workout._id}`} className="workout">
          <div>
            <button onClick={() => toggleWorkoutView({ section, workout, workoutIndex: i })}>
              View
            </button>

            <p>{workout.name}</p>

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

          {workoutIsInViewMode(`${section} ${workout._id}`) &&
            workout.exercises.map(({ sets, exercise_id, exercise }) => (
              <div key={`${section}${exercise_id}`} className="exercise">
                {exercise && (
                  <>
                    <p>{exercise?.name}</p> <p>{sets.length} sets</p>
                  </>
                )}
              </div>
            ))}
        </li>
      ))}
    </WorkoutsListContainer>
  );
}

const WorkoutsListContainer = styled.ul`
  width: 50%;

  .workout {
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
      align-content: center;

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
      .add {
        background: #eaeeff;
      }
    }
    .exercise {
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
