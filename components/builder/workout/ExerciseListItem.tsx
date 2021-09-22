import React, { useState } from "react";
import styled from "styled-components";
// Interfaces
import { Exercise } from "../../../utils/interfaces";

interface Props {
  exercise: Exercise;
  isExerciseInCustomWorkout: (exercise_id: string) => boolean;
  removeExercise: (exercise_id: string) => void;
  addExercise: (exercise: Exercise) => void;
}

const ExerciseListItem: React.FC<Props> = ({
  exercise,
  isExerciseInCustomWorkout,
  removeExercise,
  addExercise,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <Item key={exercise._id} className={isExerciseInCustomWorkout(exercise._id) ? "highlight" : ""}>
      <div className="heading">
        <h3
          onClick={
            isExerciseInCustomWorkout(exercise._id)
              ? () => removeExercise(exercise._id)
              : () => addExercise(exercise)
          }
        >
          {exercise.name}
        </h3>

        <button className="infoBtn" onClick={() => setShowInfo(!showInfo)}>
          <p>i</p>
        </button>
      </div>

      {showInfo && (
        <div className="info">
          <p>
            <span>muscle group</span> {exercise.muscleGroup}
          </p>

          <p>
            <span>muscle worked</span> {exercise.muscleWorked}
          </p>

          <p>
            <span>equipment</span> {exercise.equipment}
          </p>
        </div>
      )}
    </Item>
  );
};
export default ExerciseListItem;

const Item = styled.li`
  border-radius: 5px;
  box-shadow: 0 0 5px ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.background};
  width: 100%;
  margin: 0 1rem 0.5rem;
  text-transform: capitalize;
  transition: all 0.2s ease;

  display: flex;
  flex-direction: column;

  .heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem 0;

    h3 {
      flex: 1;
      text-align: left;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      font-weight: 300;
    }

    .infoBtn {
      background: ${({ theme }) => theme.buttonLight};
      padding: 0.25rem;
      border-radius: 5px;
      border: none;
      margin: 0 0.5rem;
      display: grid;
      place-items: center;

      p {
        border: 1px solid ${({ theme }) => theme.textLight};
        color: ${({ theme }) => theme.text};
        height: 1rem;
        width: 1rem;
        font-size: 0.6rem;
        border-radius: 50%;
      }
    }
  }

  .info {
    text-align: center;
    display: flex;
    padding: 0 0.5rem;

    p {
      flex: 1;
      display: block;
      width: 100%;
      font-size: 0.8rem;
      margin: 0 0.2rem 0.2rem;
      border-radius: 5px;
      padding: 0.25rem;
      background: ${({ theme }) => theme.buttonMed};
      span {
        color: ${({ theme }) => theme.textLight};
        margin: 0.25rem 0;
        display: block;
        font-size: 0.7rem;
        width: 100%;
      }
    }
  }

  &.highlight {
    background: ${({ theme }) => theme.accentSoft};
    color: ${({ theme }) => theme.accentText} !important;

    button {
      background: ${({ theme }) => theme.accent} !important;
      color: ${({ theme }) => theme.accentText} !important;

      p {
        color: ${({ theme }) => theme.accentText} !important;
        border-color: ${({ theme }) => theme.accentText} !important;
      }
    }

    .info p {
      background: ${({ theme }) => theme.accent} !important;
      span {
        color: ${({ theme }) => theme.accentText} !important;
      }
    }
  }
`;
