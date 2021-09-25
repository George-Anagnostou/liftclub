interface Props {
  handleExerciseOptionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  exerciseOptions: {
    exercise_id: string;
    exerciseName: string;
  }[];
}

const ExerciseSelect: React.FC<Props> = ({ handleExerciseOptionChange, exerciseOptions }) => {
  return (
    <select
      name="exerciseOptions"
      onChange={handleExerciseOptionChange}
      defaultValue="none"
      disabled={!Boolean(exerciseOptions.length)}
    >
      {/* <option value="none">2. Select Exercise</option> */}
      {exerciseOptions.map(({ exercise_id, exerciseName }) => (
        <option value={exercise_id} key={exercise_id}>
          {exerciseName}
        </option>
      ))}
    </select>
  );
};
export default ExerciseSelect;
