import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import update from "immutability-helper";
// Context
import { useUserDispatch, useUserState } from "../../store";
import { addDayToWorkoutLog } from "../../store/actions/userActions";
// Utils
import { groupWorkoutLogByExercise, dateCompare, formatIsoDate } from "../../utils";
// Interfaces
import { Exercise, WorkoutLogItem } from "../../types/interfaces";
// Components
import ExerciseInfoModal from "./ExerciseInfoModal";
import SaveNotification from "./SaveNotification";
import ExerciseBox from "./Exercise";
import ExerciseList from "../builder/workout/ExerciseList";

interface Props {
  currentWorkoutLogItem: WorkoutLogItem;
  setCurrentWorkoutLogItem: React.Dispatch<React.SetStateAction<WorkoutLogItem | null>>;
  deleteWorkout: () => Promise<void>;
  selectedDate: string;
}

const WorkoutContainerClone: React.FC<Props> = ({
  currentWorkoutLogItem,
  setCurrentWorkoutLogItem,
  deleteWorkout,
  selectedDate,
}) => {
  const { user } = useUserState();
  const dispatch = useUserDispatch();

  const exerciseMap = useRef(groupWorkoutLogByExercise(user!.workoutLog));

  const [exerciseInfo, setExerciseInfo] = useState<Exercise | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [exerciseListBottom, setExerciseListBottom] = useState(-80); // number ranging from -80 to 0

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [timer, setTimer] = useState(0);

  const handleSetLengthChange = (method: "add" | "remove", exerciseIndex: number) => {
    const exerciseSetsLength = currentWorkoutLogItem.exerciseData[exerciseIndex].sets.length;

    switch (method) {
      case "add":
        if (exerciseSetsLength >= 100) break;
        const currentLengthOfSets = currentWorkoutLogItem.exerciseData[exerciseIndex].sets.length;
        const previousSet =
          currentWorkoutLogItem.exerciseData[exerciseIndex].sets[currentLengthOfSets - 1];

        // Add empty set to spedified exercise
        setCurrentWorkoutLogItem(
          update(currentWorkoutLogItem, {
            exerciseData: {
              [exerciseIndex]: {
                sets: {
                  $push: [{ reps: previousSet?.reps || 0, weight: previousSet?.weight || -1 }],
                },
              },
            },
          })
        );
        break;
      case "remove":
        if (exerciseSetsLength === 1) break;
        // Remove last set from spedified exercise
        setCurrentWorkoutLogItem(
          update(currentWorkoutLogItem, {
            exerciseData: { [exerciseIndex]: { sets: { $splice: [[exerciseSetsLength - 1, 1]] } } },
          })
        );
        break;
      default:
        break;
    }
  };

  const addExerciseToCurrentWorkoutLogItem = (exercise: Exercise) => {
    setCurrentWorkoutLogItem({
      ...currentWorkoutLogItem,
      exerciseData: [
        ...currentWorkoutLogItem.exerciseData,
        { exercise, exercise_id: exercise._id, sets: [{ reps: 10, weight: -1 }] },
      ],
    });
  };

  const removeExerciseFromCurrentWorkoutLogItem = (exercise_id: string) => {
    setCurrentWorkoutLogItem({
      ...currentWorkoutLogItem,
      exerciseData: [
        ...currentWorkoutLogItem.exerciseData.filter((each) => each.exercise_id !== exercise_id),
      ],
    });
  };

  const handleWorkoutNoteChange = ({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (currentWorkoutLogItem)
      setCurrentWorkoutLogItem({ ...currentWorkoutLogItem, workoutNote: target.value });
  };

  // Sets weight for a specific workout. Takes the event value and exercise name
  const handleWeightChange = (
    { target }: React.ChangeEvent<HTMLInputElement>,
    exerciseIndex: number,
    setIndex: number
  ) => {
    // Cast value to number or use empty str
    const value = target.value === "" ? "" : Number(target.value);

    if (currentWorkoutLogItem?.exerciseData) {
      setCurrentWorkoutLogItem((prev) =>
        update(prev, {
          exerciseData: { [exerciseIndex]: { sets: { [setIndex]: { weight: { $set: value } } } } },
        })
      );
    }
  };

  const handleRepChange = (
    { target }: React.ChangeEvent<HTMLInputElement>,
    exerciseIndex: number,
    setIndex: number
  ) => {
    const value = Number(target.value) - 0;

    if (currentWorkoutLogItem?.exerciseData) {
      setCurrentWorkoutLogItem((prev) =>
        update(prev, {
          exerciseData: { [exerciseIndex]: { sets: { [setIndex]: { reps: { $set: value } } } } },
        })
      );
    }
  };

  // Posts currentDayData to DB
  const saveWorkout = async () => {
    if (!currentWorkoutLogItem || !user) return;
    setSaveLoading(true);

    const { workout, ...rest } = currentWorkoutLogItem;
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

  // Save workout if timer reaches 2 (seconds)
  useEffect(() => {
    if (timer === 2) {
      saveWorkout();
      setIsTyping(false);
    }
  }, [timer]);

  // Remove Saved notification after 3 seconds
  useEffect(() => {
    let resetTimeout: NodeJS.Timeout;
    if (saveSuccess) resetTimeout = setTimeout(() => setSaveSuccess(null), 3000);
    return () => clearTimeout(resetTimeout);
  }, [saveSuccess]);

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

  return (
    <>
      <WorkoutName>
        {currentWorkoutLogItem.workout ? (
          <h3>{currentWorkoutLogItem.workout.name}</h3>
        ) : (
          <h3>On the Fly - {formatIsoDate(selectedDate, 1)}</h3>
        )}
      </WorkoutName>

      <Form>
        <WorkoutList>
          {currentWorkoutLogItem.exerciseData.map(({ exercise, exercise_id, sets }, i) => (
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
              handleRepChange={(e, exerciseIndex, setIndex) =>
                handleUserInput(() => handleRepChange(e, exerciseIndex, setIndex))
              }
              handleSetLengthChange={(method, exerciseIndex) =>
                handleUserInput(() => handleSetLengthChange(method, exerciseIndex))
              }
              setExerciseInfo={setExerciseInfo}
            />
          ))}
        </WorkoutList>

        <AddExercise onClick={() => setExerciseListBottom((prev) => (prev === 0 ? -80 : 0))}>
          <p>
            Add Exercise <span>＋</span>
          </p>
        </AddExercise>

        <WorkoutNote>
          <h3>Notes</h3>
          <textarea
            key={"workoutNote"}
            name={"workoutNote"}
            cols={30}
            rows={3}
            value={currentWorkoutLogItem.workoutNote}
            onChange={(e) => handleUserInput(() => handleWorkoutNoteChange(e))}
          ></textarea>
        </WorkoutNote>
      </Form>

      <DeleteBtn onClick={deleteWorkout}>Delete Workout</DeleteBtn>

      <ExerciseList
        isExerciseInCustomWorkout={(exercise_id) =>
          currentWorkoutLogItem.exerciseData.some((elem) => elem.exercise_id === exercise_id)
        }
        addExercise={addExerciseToCurrentWorkoutLogItem}
        removeExercise={removeExerciseFromCurrentWorkoutLogItem}
        setExerciseListBottom={setExerciseListBottom}
        exerciseListBottom={exerciseListBottom}
      />

      {(saveSuccess || saveLoading) && <SaveNotification saveLoading={saveLoading} />}

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
`;

const AddExercise = styled.div`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  box-shadow: 0 2px 3px ${({ theme }) => theme.boxShadow},
    inset 0 0 2px ${({ theme }) => theme.accent};
  width: fit-content;
  margin: 0.5rem auto;
  padding: 0.5rem 2rem;
  font-weight: 300;
  border-radius: 5px;
  font-size: 1.1rem;
  transition: all 0.2s ease;

  span {
    font-weight: 200;
  }

  &:active {
    box-shadow: inset 0 2px 4px ${({ theme }) => theme.boxShadow},
      inset 0 0 1px ${({ theme }) => theme.accent};
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
