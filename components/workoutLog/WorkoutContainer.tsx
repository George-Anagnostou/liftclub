import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
// Context
import { useUserDispatch, useUserState } from "../../store";
import { addDayToWorkoutLog } from "../../store/actions/userActions";
// Utils
import { groupWorkoutLogByExercise, dateCompare } from "../../utils";
// Interfaces
import { Exercise, WorkoutLogItem } from "../../types/interfaces";
// Components
import ExerciseInfoModal from "./ExerciseInfoModal";
import { SaveNotification } from "./SaveNotification";
import ExerciseBox from "./Exercise";

interface Props {
  currentDayData: WorkoutLogItem;
  handleWeightChange: (
    { target }: React.ChangeEvent<HTMLInputElement>,
    exerciseIndex: number,
    setIndex: number
  ) => void;
  handleWorkoutNoteChange: ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => void;
  deleteWorkout: () => Promise<void>;
  selectedDate: string;
}

const WorkoutContainerClone: React.FC<Props> = ({
  currentDayData,
  handleWeightChange,
  handleWorkoutNoteChange,
  deleteWorkout,
  selectedDate,
}) => {
  const { user } = useUserState();
  const dispatch = useUserDispatch();

  const exerciseMap = useRef(groupWorkoutLogByExercise(user!.workoutLog));

  const [exerciseInfo, setExerciseInfo] = useState<Exercise | null>(null);
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

    setSaveSuccess(false); // Re-trigger save animation
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
        <h3>{currentDayData.workout?.name}</h3>
      </WorkoutName>

      <Form>
        <WorkoutList>
          {currentDayData.exerciseData.map(({ exercise, exercise_id, sets }, i) => (
            <ExerciseBox
              key={exercise_id}
              exercise={exercise}
              exercise_id={exercise_id}
              sets={sets}
              exerciseIndex={i}
              exerciseHistory={exerciseMap.current
                .get(exercise_id)
                ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                ?.filter(({ date }) => dateCompare(date, selectedDate))}
              handleWeightChange={(e, exerciseIndex, setIndex) =>
                handleUserInput(() => handleWeightChange(e, exerciseIndex, setIndex))
              }
              setExerciseInfo={setExerciseInfo}
            />
          ))}
        </WorkoutList>

        <WorkoutNote>
          <h3>Notes</h3>
          <textarea
            key={"workoutNote"}
            name={"workoutNote"}
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

      {exerciseInfo && (
        <ExerciseInfoModal exerciseInfo={exerciseInfo} setExerciseInfo={setExerciseInfo} />
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
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 0.5rem;
  border-radius: 10px;
  padding: 0.25rem 0;
  background: ${({ theme }) => theme.background};

  h3 {
    font-size: 1.4em;
    font-weight: 200;
    text-transform: capitalize;
  }
`;

const WorkoutList = styled.ul`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
    font-weight: 300;
    font-size: 1.1rem;
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
  margin: 0 auto 0.75rem;
  font-size: 1rem;
  padding: 0.25rem 1rem;
  border-radius: 5px;

  border: none;
  color: ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.background};
`;
