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
  setExerciseInfo: React.Dispatch<React.SetStateAction<Exercise | null>>;
}

const ExerciseBox: React.FC<Props> = ({
  exercise,
  exercise_id,
  sets,
  exerciseIndex,
  exerciseHistory,
  handleWeightChange,
  setExerciseInfo,
}) => {
  return (
    <Container>
      <h3 className="exercise-name">
        {exercise?.name} <span onClick={() => setExerciseInfo(exercise!)}>i</span>
      </h3>

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
  padding: 0.5rem 0;
  margin: 0 auto 0.5rem;
  text-align: center;
  background: ${({ theme }) => theme.background};

  h3 {
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    font-weight: 300;
    font-size: 1.1rem;
    letter-spacing: 1px;
    background: ${({ theme }) => theme.body};
    margin: 0 0.5rem;
    border-radius: 8px;
    padding: 0.25rem 2rem;
    position: relative;

    span {
      text-transform: lowercase;
      position: absolute;
      right: 0.5rem;
      top: 0.4rem;
      padding: 0;
      font-size: 0.7rem;
      font-weight: 600;
      height: 1.3rem;
      width: 1.3rem;
      color: ${({ theme }) => theme.buttonLight};
      border: 2px solid ${({ theme }) => theme.buttonLight};
      border-radius: 50%;
    }
  }

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
