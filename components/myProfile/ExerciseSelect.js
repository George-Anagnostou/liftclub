import styled from "styled-components";

export default function ExerciseSelect({ handleExerciseOptionChange, exerciseOptions }) {
  return (
    <Select name="exerciseOptions" onChange={handleExerciseOptionChange} defaultValue="none">
      <option value="none">Select One</option>
      {exerciseOptions.map(({ exercise_id, exerciseName }) => (
        <option value={exercise_id} key={exercise_id}>
          {exerciseName}
        </option>
      ))}
    </Select>
  );
}

const Select = styled.select`
  width: 90%;
  text-transform: capitalize;
  margin: 0.5rem 0;
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.buttonMed};
`;
