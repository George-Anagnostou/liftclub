import React, { useCallback } from "react";
import styled from "styled-components";
// Context
import { useUserState } from "../../store";
// Utils
import { hasEnteredWeight, setsAreComplete } from "../../utils/dataMutators";
import { dateCompare } from "../../utils/dateAndTime";

interface Props {
  setIndex: number;
  exerciseIndex: number;
  weight: number | string;
  reps: number;
  handleUserInput: (callback: () => void) => void;
  handleWeightChange: (
    { target }: React.ChangeEvent<HTMLInputElement>,
    exerciseIndex: number,
    setIndex: number
  ) => void;
  exercise_id: string;
  selectedDate: string;
  exerciseMap: Map<string, { sets: { reps: number; weight: string | number }[]; date: string }[]>;
}

const Set: React.FC<Props> = ({
  setIndex,
  exerciseIndex,
  weight,
  reps,
  handleUserInput,
  handleWeightChange,
  exercise_id,
  selectedDate,
  exerciseMap,
}) => {
  const { user } = useUserState();

  const getPrevExerciseData = useCallback(() => {
    const exerciseHistory = exerciseMap
      .get(exercise_id)
      ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (!exerciseHistory) return null;

    // Filter out all exercises from selected date and forward
    const beforeSelectedDate = exerciseHistory.filter(({ date }) =>
      dateCompare(date, selectedDate)
    );

    // Find the first exercise that has all its sets completed
    const first = beforeSelectedDate.find(({ sets }) => setsAreComplete(sets));

    if (first) {
      return first.sets[setIndex]?.weight;
    } else {
      return hasEnteredWeight(beforeSelectedDate[0]?.sets[setIndex]?.weight)
        ? beforeSelectedDate[0].sets[setIndex]?.weight
        : null;
    }
  }, [user?.workoutLog]);

  return (
    <SetContainer>
      <div className="reps">
        <p>{reps}</p>
      </div>

      <div className="weight">
        <input
          type="number"
          inputMode="decimal"
          defaultValue={weight >= 0 ? weight : ""}
          onChange={(e) => handleUserInput(() => handleWeightChange(e, exerciseIndex, setIndex))}
        />
      </div>

      <div className="prev">
        <p>{getPrevExerciseData()?.toString() || <span>None</span>}</p>
      </div>
    </SetContainer>
  );
};
export default Set;

const SetContainer = styled.li`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;

  width: 100%;
  margin: 0.25rem 0;

  div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  p {
    color: ${({ theme }) => theme.textLight};
    font-weight: 300;
    font-size: 1.3rem;
  }

  .weight {
    input {
      text-align: center;
      box-shadow: none;
      border: 2px solid transparent;
      border-bottom: 2px solid ${({ theme }) => theme.accentSoft};
      border-radius: 0;
      width: 5rem;
      font-size: 1.5rem;
      font-weight: 300;
      background: inherit;
      color: inherit;
      transition: all 0.25s ease;
      &:focus {
        border: 2px solid ${({ theme }) => theme.accentSoft};
        border-radius: 3px;
        outline: none;
      }
    }

    /* &::after {
      content: "lbs";
      width: 0;
      margin-left: 2px;
      color: ${({ theme }) => theme.textLight};
    } */
  }

  .prev {
    p span {
      color: ${({ theme }) => theme.textLight};
      font-size: 1rem;
    }
  }
`;
