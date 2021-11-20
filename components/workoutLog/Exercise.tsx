import React from "react";
import styled from "styled-components";
import { Exercise } from "../../types/interfaces";
import Set from "./Set";

interface Props {
  exercise: Exercise | undefined;
  exercise_id: String;
  sets: { reps: number; weight: string | number }[];
  exerciseIndex: number;
  exerciseHistory:
    | { sets: { reps: number; weight: string | number }[]; date: string }[]
    | undefined;
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
  setExerciseInfo: React.Dispatch<React.SetStateAction<Exercise | null>>;
  handleSetLengthChange: (method: "add" | "remove", exerciseIndex: number) => void;
}

const ExerciseBox: React.FC<Props> = ({
  exercise,
  exercise_id,
  sets,
  exerciseIndex,
  exerciseHistory,
  handleWeightChange,
  handleRepChange,
  setExerciseInfo,
  handleSetLengthChange,
}) => {
  return (
    <Container>
      <Header>
        <h3 className="exercise-name">
          {exercise?.name} <span onClick={() => setExerciseInfo(exercise!)}>i</span>
        </h3>
        <div className="set-ctrl">
          <span onClick={() => handleSetLengthChange("remove", exerciseIndex)}>-</span>
          <p>SET</p>
          <span onClick={() => handleSetLengthChange("add", exerciseIndex)}>+</span>
        </div>
      </Header>

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
            exerciseIndex={exerciseIndex}
            handleWeightChange={handleWeightChange}
            handleRepChange={handleRepChange}
            exerciseHistory={exerciseHistory}
          />
        ))}
      </ul>
    </Container>
  );
};

export default ExerciseBox;

const Container = styled.li`
  width: 100%;
  border-radius: 10px;
  padding: 0.25rem 0 0.5rem;
  margin: 0 auto 0.5rem;
  text-align: center;
  background: ${({ theme }) => theme.background};

  ul {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .set-title {
      color: ${({ theme }) => theme.textLight};
      font-size: 0.6rem;
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
`;

const Header = styled.div`
  background: ${({ theme }) => theme.body};
  margin: 0 0.25rem;
  border-radius: 8px;
  padding: 0.5rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .exercise-name {
    flex: 2;
    font-weight: 300;
    font-size: 1.1rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-transform: uppercase;
    text-align: left;
    letter-spacing: 1px;

    span {
      text-align: center;
      text-transform: lowercase;
      display: block;
      padding: 0;
      font-size: 0.7rem;
      font-weight: 600;
      height: 1.3rem;
      min-width: 1.3rem;
      color: ${({ theme }) => theme.buttonLight};
      border: 2px solid ${({ theme }) => theme.buttonLight};
      border-radius: 50%;
      margin-left: 0.5rem;
    }
  }

  .set-ctrl {
    min-width: max-content;
    display: flex;
    align-items: center;

    p {
      font-weight: 200;
      margin-left: 0.5rem;
    }

    span {
      color: ${({ theme }) => theme.textLight};
      margin-left: 0.5rem;
      font-size: 1.5rem;
      font-weight: 300;
      line-height: 2.1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 2rem;
      width: 2rem;
      border-radius: 50%;
      box-shadow: 0 0 3px ${({ theme }) => theme.accent};
    }
  }
`;
