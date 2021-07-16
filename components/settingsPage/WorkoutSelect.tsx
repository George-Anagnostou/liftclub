import styled from "styled-components";
// Interfaces
import { Workout } from "../../utils/interfaces";

interface Props {
  handleWorkoutOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  workoutOptions: Workout[];
}

const WorkoutSelect: React.FC<Props> = ({ handleWorkoutOptionChange, workoutOptions }) => {
  return (
    <Select name="workoutOptions" onChange={handleWorkoutOptionChange} defaultValue="none">
      <option value="none">1. Select Workout</option>
      {workoutOptions.map((workout) => (
        <option value={workout._id} key={workout._id}>
          {workout.name}
        </option>
      ))}
    </Select>
  );
};
export default WorkoutSelect;

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
