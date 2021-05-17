import styled from "styled-components";
import Checkmark from "../Checkmark";

export default function Workout({
  saveWorkout,
  currentDayData,
  handleWeightChange,
  handleWorkoutNoteChange,
  workoutNote,
  prevBestData,
  savedSuccessfully,
}) {
  return (
    <>
      <SaveWorkoutButton onClick={saveWorkout}>
        Save Workout
        {savedSuccessfully && (
          <Checkmark position={{ position: "absolute", top: "15px", right: "15px" }} />
        )}
      </SaveWorkoutButton>

      <WorkoutName>
        <h1>{currentDayData.workoutName}</h1>
        <h3>{currentDayData.exerciseData.length} exercises</h3>
      </WorkoutName>

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
                  </div>

                  <div className="prev">
                    {prevBestData?.exerciseData[i]?.sets[j]?.weight >= 0 ? (
                      <p>{prevBestData?.exerciseData[i]?.sets[j]?.weight}</p>
                    ) : (
                      <span>None</span>
                    )}
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
  justify-content: space-evenly;
  align-items: flex-end;
  width: 100%;
  h1 {
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
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px #aaaaaa;

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
    border-radius: 10px;
    padding: 0.5rem 0;
    max-width: 100%;

    margin: 0.75rem 0;
    text-align: center;

    h3 {
      text-transform: uppercase;
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
            box-shadow: none;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 5rem;
            font-size: 2rem;
            font-weight: 200;
            transition: all 0.1s ease-in-out;

            &:focus {
              box-shadow: 0 2px 4px #8f8f8f;
            }
          }
          &::after {
            content: "lbs";
            width: 0;
          }
        }

        .prev {
          p {
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
  padding: 1rem;
  text-align: left;

  textarea {
    padding: 0.5rem;
    border-radius: 5px;
    box-shadow: none;
    border: 1px solid #b9b9b9;
    min-width: 200px;
    max-width: 85vw;
    font-size: 1.2rem;
    font-family: inherit;
    resize: none;
    transition: all 0.1s ease-in-out;

    &:focus {
      box-shadow: 0 5px 8px #757575;
    }
  }

  @media (max-width: 425px) {
    width: 98%;
    textarea {
      width: 100%;
      max-width: unset;
    }
  }
`;
