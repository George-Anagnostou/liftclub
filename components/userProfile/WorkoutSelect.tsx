// Interfaces
import { Workout } from "../../types/interfaces";

interface Props {
  handleWorkoutOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  workoutOptions: Workout[];
}

const WorkoutSelect: React.FC<Props> = ({ handleWorkoutOptionChange, workoutOptions }) => {
  return (
    <select name="workoutOptions" onChange={handleWorkoutOptionChange} defaultValue="none">
      <option value="none">1. Select Workout</option>
      {workoutOptions.map((workout) => (
        <option value={workout._id} key={workout._id}>
          {workout.name}
        </option>
      ))}
    </select>
  );
};
export default WorkoutSelect;
