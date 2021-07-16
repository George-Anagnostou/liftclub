import styled from "styled-components";

interface Props {
  handleExerciseOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  exerciseOptions: {
    exercise_id: string;
    exerciseName: string;
  }[];
}

const ExerciseSelect: React.FC<Props> = ({ handleExerciseOptionChange, exerciseOptions }) => {
  return (
    <Select
      name="exerciseOptions"
      onChange={handleExerciseOptionChange}
      defaultValue="none"
      disabled={!Boolean(exerciseOptions.length)}
    >
      <option value="none">2. Select Exercise</option>
      {exerciseOptions.map(({ exercise_id, exerciseName }) => (
        <option value={exercise_id} key={exercise_id}>
          {exerciseName}
        </option>
      ))}
    </Select>
  );
};
export default ExerciseSelect;

const Select = styled.select`
  width: 90%;
  text-transform: capitalize;
  margin: 0.25rem 0;
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.buttonMed};

  &:disabled {
    opacity: 0.5;
  }
`;
