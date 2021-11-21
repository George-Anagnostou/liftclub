import React, { useCallback } from "react";
import styled from "styled-components";
// Context
import { useUserState } from "../../store";
// Utils
import { hasEnteredWeight, setsAreComplete } from "../../utils";

interface Props {
  setIndex: number;
  exerciseIndex: number;
  weight: number | string;
  reps: number;
  handleWeightChange: (
    { target }: React.ChangeEvent<HTMLInputElement>,
    exerciseIndex: number,
    setIndex: number
  ) => void;
  handleRepChange: (
    { target }: React.ChangeEvent<HTMLInputElement>,
    exerciseIndex: number,
    setIndex: number
  ) => void;
  exerciseHistory:
    | { sets: { reps: number; weight: string | number }[]; date: string }[]
    | undefined;
}

const Set: React.FC<Props> = ({
  setIndex,
  exerciseIndex,
  weight,
  reps,
  handleWeightChange,
  handleRepChange,
  exerciseHistory,
}) => {
  const { user } = useUserState();

  const getPrevExerciseData = useCallback(() => {
    if (!exerciseHistory) return null;

    // Find the first exercise that has all its sets completed
    const first = exerciseHistory.find(({ sets }) => setsAreComplete(sets));

    if (first) {
      return first.sets[setIndex]?.weight;
    } else {
      return hasEnteredWeight(exerciseHistory[0]?.sets[setIndex]?.weight)
        ? exerciseHistory[0].sets[setIndex]?.weight
        : null;
    }
  }, [user?.workoutLog]);

  return (
    <SetContainer>
      <div className="set-index">
        <p>{setIndex + 1}</p>
      </div>

      <div className="reps">
        <input
          type="text"
          pattern="[0-9]*"
          inputMode="numeric"
          value={reps}
          onChange={(e) => handleRepChange(e, exerciseIndex, setIndex)}
        />
      </div>

      <p className="x-symbol">✕</p>

      <div className="weight">
        <input
          type="number"
          inputMode="decimal"
          defaultValue={weight >= 0 ? weight : ""}
          onChange={(e) => handleWeightChange(e, exerciseIndex, setIndex)}
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
  margin: 0.35rem 0;

  .set-index {
    flex: 0.25;
    color: ${({ theme }) => theme.textLight};
    font-weight: 200;
    font-size: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      border: 1px solid ${({ theme }) => theme.border};
      border-radius: 50%;
      height: 22px;
      width: 22px;
    }
  }
  .x-symbol {
    flex: 0;
    color: ${({ theme }) => theme.border};
  }

  .weight,
  .reps {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    input {
      text-align: center;
      box-shadow: none;
      border: 2px solid transparent;
      border-bottom: 1px solid ${({ theme }) => theme.accentSoft};
      border-radius: 0;
      width: 5rem;
      font-size: 1.5rem;
      font-weight: 400;
      background: inherit;
      color: inherit;
      transition: all 0.25s ease;
      &:focus {
        border: 1px solid ${({ theme }) => theme.accentSoft};
        border-radius: 3px;
        outline: none;
      }
    }
  }

  .prev {
    flex: 0.25;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    p {
      color: ${({ theme }) => theme.textLight};
      font-weight: 200;
      font-size: 1rem;
      span {
        color: ${({ theme }) => theme.textLight};
        font-size: 0.8em;
      }
    }
  }
`;
