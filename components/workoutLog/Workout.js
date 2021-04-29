import styled from "styled-components";

export default function Workout({
  saveWorkout,
  currentDayData,
  handleWeightChange,
  handleWeightUnitChange,
  handleWorkoutNoteChange,
  workoutNote,
}) {
  return (
    <>
      <SaveWorkoutButton onClick={saveWorkout}>Save Workout</SaveWorkoutButton>

      <WorkoutList>
        {currentDayData.exerciseData?.map(({ exercise, exercise_id, sets }, i) => (
          <li className="exercise" key={exercise_id}>
            <h3 className="exercise-name">{exercise.name}</h3>
            <ul>
              {sets.map(({ reps, weight, weightUnit }, j) => (
                <li className="set" key={`${exercise_id} ${j}`}>
                  <p>
                    <span>{reps}</span> reps
                  </p>

                  <div>
                    <input
                      type="number"
                      name="weight"
                      id="weight"
                      value={weight || ""}
                      onChange={(e) => handleWeightChange(e, i, j)}
                    />
                    <select
                      name="unit"
                      id="unit"
                      defaultValue={weightUnit}
                      onChange={(e) => handleWeightUnitChange(e, i, j)}
                    >
                      <option value="lbs">lbs</option>
                      <option value="pin">pin</option>
                    </select>
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
          name=""
          id=""
          cols="30"
          rows="5"
          value={workoutNote}
          onChange={handleWorkoutNoteChange}
        ></textarea>
      </WorkoutNote>

      <SaveWorkoutButton onClick={saveWorkout}>Save Workout</SaveWorkoutButton>
    </>
  );
}

const SaveWorkoutButton = styled.button`
  margin: 1rem auto;
  font-size: 1.5rem;
  padding: 0.5rem;
  background: inherit;
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;

  @media (max-width: 500px) {
    width: 100%;
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

        p {
          padding-right: 2rem;
          font-size: 0.6rem;
          span {
            font-weight: 700;
            font-size: 3rem;
          }
        }
        div {
          display: flex;
          align-items: flex-end;
          justify-content: center;

          input {
            width: 6.5rem;
            font-size: 3rem;
            font-weight: 200;
          }

          select {
            margin-left: 0.2rem;
            border: 1px solid grey;
            border-radius: 2px;
            font-size: 1.5rem;
            option {
            }
          }
        }
      }
    }
  }

  @media (max-width: 500px) {
    .exercise {
      width: 100%;

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
  }

  @media (max-width: 500px) {
    width: 100%;
    textarea {
      width: 100%;
      max-width: unset;
    }
  }
`;
