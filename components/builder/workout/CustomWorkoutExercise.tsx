import styled from "styled-components";
import { Exercise } from "../../../utils/interfaces";

interface Props {
  i: number;
  sets: {
    reps: number;
    weight: number;
  }[];
  exercise: Exercise;
  handleSetChange: (method: "add" | "remove", exerciseIndex: number) => void;
  handleRepChange: (e: any, exerciseIndex: number, setIndex: number) => void;
  removeExercise: (exercise: Exercise) => void;
}

const CustomWorkoutExercise: React.FC<Props> = ({
  i,
  sets,
  exercise,
  handleSetChange,
  handleRepChange,
  removeExercise,
}) => {
  return (
    <ExerciseContainer key={exercise._id}>
      <p className="exTitle">
        <span>{i + 1}.</span> {exercise.name}
      </p>

      <div className="setControl">
        <button onClick={() => handleSetChange("remove", i)} disabled={!Boolean(sets.length)}>
          -
        </button>
        <p>Set</p>
        <button onClick={() => handleSetChange("add", i)}>+</button>
      </div>

      {sets.map(({ reps }, j) => (
        <div key={j}>
          <span>{j + 1}.</span>
          <input
            type="number"
            name="reps"
            value={reps}
            onChange={(e) => handleRepChange(e, i, j)}
          />
          <span>reps</span>
        </div>
      ))}

      <button className="removeBtn" onClick={() => removeExercise(exercise)}>
        Remove
      </button>
    </ExerciseContainer>
  );
};
export default CustomWorkoutExercise;

const ExerciseContainer = styled.li`
  border-radius: 5px;
  box-shadow: 0 0 5px ${({ theme }) => theme.boxShadow};
  background: ${({ theme }) => theme.background};
  width: 100%;
  flex: 1;
  min-width: 150px;
  max-width: 160px;
  margin: 0.5rem;
  text-align: center;
  position: relative;

  display: flex;
  flex-direction: column;
  .exTitle {
    padding: 0.5rem;
    text-transform: capitalize;
  }
  div {
    margin: 0.2rem 0;
    display: flex;
    align-items: center;

    input {
      width: 3rem;
      font-size: 1.25rem;
      padding: 0.25rem 0;
      margin: 0 0.25rem;
      background: ${({ theme }) => theme.body};
      color: inherit;
      text-align: center;
      border-radius: 3px;
      border: 1px solid ${({ theme }) => theme.border};
    }
    span {
      font-weight: 300;
      font-size: 0.7rem;
      flex: 1;
    }
  }
  .setControl {
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      margin: 0 0.5rem;
    }
    button {
      flex: 1;
      border: 1px solid ${({ theme }) => theme.border};
      background: ${({ theme }) => theme.buttonMed};
      color: inherit;
      border-radius: 3px;
      margin: 0.15rem;
      height: 2rem;
      width: 2rem;
      font-size: 1.2rem;
      transition: all 0.3s ease;

      &:disabled {
        color: ${({ theme }) => theme.border};
        background: ${({ theme }) => theme.background};
        border: 1px solid ${({ theme }) => theme.buttonLight};
      }
    }
  }
  .removeBtn {
    border: none;
    background: ${({ theme }) => theme.buttonMed};
    color: ${({ theme }) => theme.textLight};
    padding: 0.5rem 0;
    border-radius: 0 0px 5px 5px;
  }
`;
