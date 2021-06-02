import React, { useState } from "react";
import styled from "styled-components";

export default function ExerciseListItem({
  exercise,
  isExerciseInCustomWorkout,
  removeExercise,
  addExercise,
}) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <Item key={exercise._id} className={isExerciseInCustomWorkout(exercise._id) ? "highlight" : ""}>
      <div className="heading">
        <h3>{exercise.name}</h3>

        <div>
          {isExerciseInCustomWorkout(exercise._id) ? (
            <button className="ctrlBtn" onClick={() => removeExercise(exercise)}>
              Remove
            </button>
          ) : (
            <button className="ctrlBtn" onClick={() => addExercise(exercise)}>
              Add
            </button>
          )}

          <button className="infoBtn" onClick={() => setShowInfo(!showInfo)}>
            <p>i</p>
          </button>
        </div>
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
}

const Item = styled.li`
  border-radius: 5px;
  box-shadow: 0 0 5px ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.buttonLight};
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

    h3 {
      text-align: left;
      padding: 0.5rem;
      font-size: 1.1rem;
      font-weight: 100;
      letter-spacing: 1px;
    }
    div {
      display: flex;
      justify-content: center;
      align-items: center;

      .infoBtn {
        padding: 0.5rem;
        border-radius: 5px;
        background: ${({ theme }) => theme.buttonMed};
        border: 1px solid ${({ theme }) => theme.buttonLight};
        margin: 0 0.5rem;
        p {
          border: 1px solid ${({ theme }) => theme.textLight};
          color: ${({ theme }) => theme.text};
          height: 1rem;
          width: 1rem;
          border-radius: 50%;
        }
      }
      .ctrlBtn {
        border: 1px solid ${({ theme }) => theme.buttonLight};
        background: ${({ theme }) => theme.buttonMed};
        color: ${({ theme }) => theme.textLight};
        padding: 0.5rem;
        border-radius: 5px;
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
    button {
      border: 1px solid ${({ theme }) => theme.accentSoft} !important;
      background: ${({ theme }) => theme.accent} !important;
      color: ${({ theme }) => theme.text} !important;
    }
    .info p {
      background: ${({ theme }) => theme.accent} !important;
    }
  }
`;
