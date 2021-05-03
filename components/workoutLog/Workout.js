import styled from "styled-components";

export default function Workout({
  saveWorkout,
  currentDayData,
  handleWeightChange,
  handleWorkoutNoteChange,
  workoutNote,
}) {
  return (
    <>
      {currentDayData.workoutName && <WorkoutName>{currentDayData.workoutName}</WorkoutName>}

      <SaveWorkoutButton onClick={saveWorkout}>Save Workout</SaveWorkoutButton>

      <WorkoutList>
        {currentDayData.exerciseData.map(({ exercise, exercise_id, sets }, i) => (
          <li className="exercise" key={exercise_id}>
            <h3 className="exercise-name">{exercise?.name}</h3>
            <ul>
              {sets.map(({ reps, weight }, j) => (
                <li className="set" key={`${exercise_id} ${j}`}>
                  <div className="reps">
                    <p>{reps}</p>
                    <span>reps</span>
                  </div>

                  <div className="weight">
                    <input
                      type="number"
                      value={weight || ""}
                      onChange={(e) => handleWeightChange(e, i, j)}
                    />
                    <span>lbs</span>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </WorkoutList>

      <WorkoutNote>
        <h3>Notes:</h3>
        <textarea
          name="workoutNote"
          cols="30"
          rows="5"
          value={workoutNote}
          onChange={handleWorkoutNoteChange}
        ></textarea>
      </WorkoutNote>
    </>
  );
}

const WorkoutName = styled.h1`
  text-transform: uppercase;
  margin-top: 0.5rem;
`;

const SaveWorkoutButton = styled.button`
  position: sticky;
  top: 0.5rem;
  margin: 1rem auto;
  font-size: 1.5rem;
  padding: 0.5rem;
  background: white;
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;

  &:hover {
    background: #e3f7ff;
  }

  @media (max-width: 500px) {
    width: 98%;
  }
`;

const WorkoutList = styled.ul`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-wrap: wrap;

  .exercise {
    box-shadow: 0 0 5px grey;
    border-radius: 10px;
    padding: 0.5rem;
    max-width: 100%;

    margin: 0.5rem 0;
    text-align: center;

    h3 {
      text-transform: uppercase;
    }

    ul {
      width: fit-content;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .set {
        display: flex;
        justify-content: center;
        align-items: center;

        width: fit-content;
        margin: 1rem;

        div {
          display: flex;
          align-items: flex-end;
        }

        .reps {
          margin-right: 2rem;

          p {
            font-weight: 600;
            font-size: 3rem;
          }
          span {
            margin-bottom: 0.5rem;
          }
        }

        .weight {
          input {
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 6rem;
            font-size: 3rem;
            font-weight: 200;
          }
        }

        span {
          font-size: 1rem;
        }
      }
    }
  }

  @media (max-width: 500px) {
    .exercise {
      width: 98%;

      ul {
        width: 100%;

        .set {
          width: 100%;
        }
      }
    }
  }
`;

const WorkoutNote = styled.div`
  margin: 1rem auto;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  padding: 1rem;
  text-align: left;

  textarea {
    padding: 0.5rem;
    border-radius: 5px;
    box-shadow: 0 0 5px #b9b9b9;
    border: 1px solid #b9b9b9;
    min-width: 200px;
    max-width: 85vw;
    font-size: 1.2rem;
    font-family: inherit;
    resize: none;
  }

  @media (max-width: 500px) {
    width: 98%;
    textarea {
      width: 100%;
      max-width: unset;
    }
  }
`;
