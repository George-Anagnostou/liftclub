import { useEffect, useState } from "react";
import styled from "styled-components";
// Context
import { useStoreDispatch, useStoreState } from "../../store";
import { addDayToWorkoutLog } from "../../store/actions/userActions";
// Interfaces
import { WorkoutLogItem } from "../../utils/interfaces";
// Components
import { SaveNotification } from "./SaveNotification";
import Set from "./Set";

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
  selectedDate: string;
}

const WorkoutContainerClone: React.FC<Props> = ({
  currentDayData,
  handleWeightChange,
  handleWorkoutNoteChange,
  prevBestData,
  deleteWorkout,
  selectedDate,
}) => {
  const { user } = useStoreState();
  const dispatch = useStoreDispatch();

  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [timer, setTimer] = useState(0);

  // Posts currentDayData to DB
  const saveWorkout = async () => {
    if (!currentDayData || !user) return;

    setSaveLoading(true);

    const { workout, ...rest } = currentDayData;

    const saved = await addDayToWorkoutLog(dispatch, user._id, rest, selectedDate);

    // Re-trigger animations
    setSaveSuccess(false);
    setSaveSuccess(saved);

    setSaveLoading(false);
  };

  // Intermediary function that handles all Workout inputs
  const handleUserInput = (callback: () => void) => {
    setIsTyping(true);
    setTimer(0);
    callback();
  };

  // Handle updates with timer and isTyping states
  useEffect(() => {
    let interval: NodeJS.Timeout = setInterval(() => {}, 0);

    isTyping
      ? (interval = setInterval(() => setTimer((prev) => (prev += 1)), 1000))
      : clearInterval(interval);

    return () => clearInterval(interval);
  }, [isTyping]);

  // Save workout if timer reaches 3 (seconds)
  useEffect(() => {
    if (timer === 3) {
      saveWorkout();
      setIsTyping(false);
    }
  }, [timer]);

  // Enable user to use "Enter" key to go down the list of inputs
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

  // Remove Saved notification after 3 seconds
  useEffect(() => {
    let resetTimeout: NodeJS.Timeout;

    if (saveSuccess) resetTimeout = setTimeout(() => setSaveSuccess(null), 3000);

    return () => clearTimeout(resetTimeout);
  }, [saveSuccess]);

  return (
    <>
      <WorkoutName>
        {/* <h3 className="date">{new Date(selectedDate).toDateString().substring(3, 10)}</h3> */}
        <h3 className="workout-name">{currentDayData.workout?.name}</h3>
      </WorkoutName>

      <Form>
        <WorkoutList>
          {currentDayData.exerciseData.map(({ exercise, exercise_id, sets }, i) => (
            <li className="exercise" key={exercise_id}>
              <h3 className="exercise-name">{exercise?.name}</h3>
              <ul>
                <li className="set-title">
                  <p>Reps</p>
                  <p>Weight</p>
                  <p>Previous</p>
                </li>

                {sets.map(({ weight, reps }, j) => (
                  <Set
                    key={`${exercise_id} ${j}`}
                    reps={reps}
                    weight={weight}
                    setIndex={j}
                    exerciseIndex={i}
                    handleUserInput={handleUserInput}
                    handleWeightChange={handleWeightChange}
                    prevBestData={prevBestData}
                  />
                ))}
              </ul>
            </li>
          ))}
        </WorkoutList>

        <WorkoutNote>
          <h3>Notes</h3>
          <textarea
            key={"workoutNote"}
            name="workoutNote"
            cols={30}
            rows={3}
            value={currentDayData.workoutNote}
            onChange={(e) => handleUserInput(() => handleWorkoutNoteChange(e))}
          ></textarea>
        </WorkoutNote>
      </Form>

      <DeleteBtn onClick={deleteWorkout}>Delete Workout</DeleteBtn>

      {currentDayData && (saveSuccess || saveLoading) && (
        <SaveNotification saveLoading={saveLoading} />
      )}
    </>
  );
};

export default WorkoutContainerClone;

const Form = styled.form`
  width: 100%;
`;

const WorkoutName = styled.div`
  width: 100%;
  padding: 0.5rem;

  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  margin-bottom: 0.5rem;

  h3 {
    font-size: 1.3em;
    font-weight: 300;
    text-transform: capitalize;
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
      font-weight: 400;
      font-size: 1.3rem;
      letter-spacing: 1px;
      background: ${({ theme }) => theme.body};
      margin: 0 0.5rem;
      border-radius: 8px;
      padding: 0.25rem 0;
    }

    ul {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .set-title {
        color: ${({ theme }) => theme.textLight};
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
    }
  }
`;

const WorkoutNote = styled.div`
  width: 100%;
  margin: 1rem auto;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  background: ${({ theme }) => theme.background};

  h3 {
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    font-weight: 400;
    font-size: 1.3rem;
    letter-spacing: 1px;
    background: ${({ theme }) => theme.body};
    border-radius: 8px;
    padding: 0.25rem 0;
  }

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
      box-shadow: 0 0 1px 2px ${({ theme }) => theme.accentSoft};
      outline: none;
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
