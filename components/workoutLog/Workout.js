import styled from "styled-components";

export default function Workout({
  currentDayData,
  handleWeightChange,
  handleWorkoutNoteChange,
  workoutNote,
  prevBestData,
  deleteWorkout,
}) {
  return (
    <>
      <WorkoutName>
        <h3 style={{ textTransform: "capitalize" }}>{currentDayData.workoutName}</h3>
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

      <DeleteBtn onClick={deleteWorkout}>Delete Workout</DeleteBtn>
    </>
  );
}

const WorkoutName = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;

  width: 100%;
  border-radius: 10px;
  background: ${({ theme }) => theme.background};
  padding: 0.75rem 0;
  margin: 0.5rem 0;
`;

const WorkoutList = styled.ul`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .exercise {
    width: 100%;
    border-radius: 10px;
    padding: 0.5rem 0;
    margin: 0.75rem 0;
    text-align: center;
    background: ${({ theme }) => theme.background};

    h3 {
      text-transform: uppercase;
    }

    ul {
      width: 100%;
      display: flex;
      flex-direction: column;
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
            border: 1px solid ${({ theme }) => theme.border};
            border-radius: 5px;
            width: 5rem;
            font-size: 2rem;
            font-weight: 200;
            transition: all 0.1s ease-in-out;
            background: inherit;
            color: inherit;

            &:focus {
              box-shadow: 0 2px 4px #8f8f8f;
            }
          }
          &::after {
            content: " lbs";
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
`;

const WorkoutNote = styled.div`
  width: 100%;
  margin: 1rem auto;
  border-radius: 5px;
  padding: 1rem;
  text-align: left;
  background: ${({ theme }) => theme.background};

  textarea {
    padding: 0.5rem;
    border-radius: 5px;
    box-shadow: none;
    border: 1px solid ${({ theme }) => theme.border};
    min-width: 200px;
    width: 100%;
    max-width: unset;
    font-size: 1.2rem;
    font-family: inherit;
    resize: none;
    transition: all 0.1s ease-in-out;
    background: inherit;
    color: inherit;

    &:focus {
      box-shadow: 0 5px 8px #757575;
    }
  }
`;

const DeleteBtn = styled.button`
  width: 100%;
  margin: 0.5rem auto;
  font-size: 1.2rem;
  padding: 0.75rem;
  border-radius: 10px;

  border: none;
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};
`;
