import { useEffect, useState } from "react";
import styled from "styled-components";
// Interfaces
import { WorkoutLogItem } from "../../utils/interfaces";

interface Props {
  currentDayData: WorkoutLogItem;
  handleWeightChange: (
    { target }: React.ChangeEvent<HTMLInputElement>,
    exerciseIndex: number,
    setIndex: number
  ) => void;
  handleWorkoutNoteChange: ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => void;
  prevBestData: WorkoutLogItem | null;
  deleteWorkout: () => Promise<void>;
  saveWorkout: () => Promise<void>;
}

const WorkoutContainer: React.FC<Props> = ({
  currentDayData,
  handleWeightChange,
  handleWorkoutNoteChange,
  prevBestData,
  deleteWorkout,
  saveWorkout,
}) => {
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [timer, setTimer] = useState(0);

  const handleUserInput = (callback: () => void) => {
    setIsTyping(true);
    setTimer(0);

    callback();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout = setInterval(() => {}, 0);

    if (isTyping) {
      interval = setInterval(() => setTimer((prev) => (prev += 1)), 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTyping]);

  useEffect(() => {
    if (timer === 2) {
      saveWorkout();
      setIsTyping(false);
    }
  }, [timer]);

  useEffect(() => {
    const useEnterAsTab = (e) => {
      if (e.keyCode === 13 && e.target.nodeName === "INPUT") {
        const form = e.target.form;
        const index = Array.prototype.indexOf.call(form, e.target);
        form.elements[index + 1].focus();
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", useEnterAsTab);

    return () => document.removeEventListener("keydown", useEnterAsTab);
  }, []);

  return (
    <>
      <WorkoutName>
        <h3 style={{ textTransform: "capitalize" }}>{currentDayData.workoutName}</h3>
        <h3>
          {currentDayData.exerciseData.length} <span>Exercises</span>
        </h3>
      </WorkoutName>

      <Form>
        <WorkoutList>
          {currentDayData.exerciseData.map(({ exercise, exercise_id, sets }, i) => (
            <li className="exercise" key={exercise_id}>
              <h3 className="exercise-name">{exercise!.name}</h3>
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
                        onChange={(e) => handleUserInput(() => handleWeightChange(e, i, j))}
                      />
                    </div>

                    <div className="prev">
                      {prevBestData && prevBestData.exerciseData[i]?.sets[j].weight >= 0 ? (
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
            cols={30}
            rows={5}
            value={currentDayData.workoutNote}
            onChange={(e) => handleUserInput(() => handleWorkoutNoteChange(e))}
          ></textarea>
        </WorkoutNote>
      </Form>

      <DeleteBtn onClick={deleteWorkout}>Delete Workout</DeleteBtn>
    </>
  );
};

export default WorkoutContainer;

const Form = styled.form`
  width: 100%;
`;

const WorkoutName = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 0.5rem;

  h3 {
    font-weight: 400;
  }
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
    margin: 0 auto 0.5rem;
    text-align: center;
    background: ${({ theme }) => theme.background};

    h3 {
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      font-weight: 300;
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
          font-size: 1.5rem;
        }

        .weight {
          input {
            text-align: center;
            box-shadow: none;
            border: none;
            border-bottom: 2px solid ${({ theme }) => theme.accentSoft};
            border-radius: 0;
            width: 5rem;
            font-size: 1.5rem;
            font-weight: 300;
            transition: all 0.1s ease-in-out;
            background: inherit;
            color: inherit;

            &:focus {
              box-shadow: 0 0 6px ${({ theme }) => theme.boxShadow};
              outline: 1px solid ${({ theme }) => theme.accentSoft};
              -moz-outline-radius: 5px;
            }
          }
          &::after {
            content: " lbs";
            width: 0;
            color: ${({ theme }) => theme.textLight};
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
  border-radius: 10px;
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
  margin: 0 auto 0.5rem o;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 5px;

  border: none;
  color: ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
  box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};
`;
