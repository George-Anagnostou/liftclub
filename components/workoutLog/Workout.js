import styled from "styled-components";

export default function Workout({
  saveWorkout,
  currentDayData,
  handleWeightChange,
  handleWorkoutNoteChange,
  workoutNote,
  prevBestData,
}) {
  return (
    <>
      <SaveWorkoutButton onClick={saveWorkout}>Save Workout</SaveWorkoutButton>

      {currentDayData.workoutName && (
        <WorkoutName>
          <h2>{currentDayData.workoutName}</h2>
          <p>{currentDayData.exerciseData.length} exercises</p>
        </WorkoutName>
      )}

      <WorkoutList>
        {currentDayData.exerciseData.map(({ exercise, exercise_id, sets }, i) => (
          <li className="exercise" key={exercise_id}>
            <h3 className="exercise-name">{exercise.name}</h3>
            <ul>
              <li className="set-title">
                <p>Reps</p>
                <p>Weight</p>
                <p>Previous</p>
              </li>

              {sets.map(({ reps, weight }, j) => (
                <li className="set" key={`${exercise_id} ${j}`}>
                  <div className="reps">
                    <p>{reps}</p>
                  </div>

                  <div className="weight">
                    <input
                      type="number"
                      value={weight >= 0 ? weight : ""}
                      onChange={(e) => handleWeightChange(e, i, j)}
                    />
                    <span>lbs</span>
                  </div>

                  <div>
                    <p>
                      {prevBestData?.exerciseData[i]?.sets[j]?.weight >= 0
                        ? prevBestData?.exerciseData[i]?.sets[j]?.weight
                        : "none"}
                    </p>
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

const WorkoutName = styled.div`
  display: flex;
  width: 98%;
  justify-content: space-around;
  align-items: flex-end;
  h2 {
    text-transform: uppercase;
  }
`;

const SaveWorkoutButton = styled.button`
  width: 98%;
  position: sticky;
  top: 0.5rem;
  margin: 1rem auto;
  font-size: 1.5rem;
  padding: 1rem 0.5rem;
  background: white;
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;

  &:hover {
    background: #eaeeff;
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
    padding: 0.5rem 0;
    max-width: 100%;

    margin: 0.5rem 0;
    text-align: center;

    h3 {
      text-transform: uppercase;
      border-bottom: 2px solid #eaeeff;
    }

    ul {
      width: fit-content;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .set-title {
        display: flex;
        justify-content: space-evenly;
        align-items: flex-end;
        width: 100%;
        margin: 0.5rem 0;
        p {
          flex: 1;
          text-align: center;
        }
      }

      .set {
        display: flex;
        justify-content: space-evenly;
        align-items: flex-end;

        width: 100%;
        margin: 0.5rem 0;

        div {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }

        p {
          font-weight: 300;
          font-size: 2rem;
        }

        .weight {
          input {
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 5rem;
            font-size: 2rem;
            font-weight: 200;
          }
        }
      }
    }
  }

  @media (max-width: 425px) {
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

  @media (max-width: 425px) {
    width: 98%;
    textarea {
      width: 100%;
      max-width: unset;
    }
  }
`;
