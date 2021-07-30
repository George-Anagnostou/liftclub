import React from "react";
import styled from "styled-components";
// Interfaces
import { WorkoutLogItem } from "../../utils/interfaces";

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
  prevBestData: WorkoutLogItem | null;
}

const Set: React.FC<Props> = ({
  setIndex,
  exerciseIndex,
  weight,
  reps,
  handleUserInput,
  handleWeightChange,
  prevBestData,
}) => {
  return (
    <SetContainer>
      <div className="reps">
        <p>{reps}</p>
      </div>

      <div className="weight">
        <input
          type="number"
          defaultValue={weight >= 0 ? weight : ""}
          onChange={(e) => handleUserInput(() => handleWeightChange(e, exerciseIndex, setIndex))}
        />
      </div>

      <div className="prev">
        {prevBestData && prevBestData.exerciseData[exerciseIndex]?.sets[setIndex]?.weight >= 0 ? (
          <p>{prevBestData?.exerciseData[exerciseIndex]?.sets[setIndex]?.weight}</p>
        ) : (
          <span>None</span>
        )}
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
  margin: 0.5rem 0;

  div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  p {
    color: ${({ theme }) => theme.textLight};
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
`;