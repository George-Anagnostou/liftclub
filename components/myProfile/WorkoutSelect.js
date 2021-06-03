import styled from "styled-components";

export default function WorkoutSelect({ handleWorkoutOptionChange, workoutOptions }) {
  return (
    <Select name="workoutOptions" onChange={handleWorkoutOptionChange} defaultValue="none">
      <option value="none">Select One</option>
      {workoutOptions.map((workout) => (
        <option value={workout._id} key={workout._id}>
          {workout.name}
        </option>
      ))}
    </Select>
  );
}

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
`;
