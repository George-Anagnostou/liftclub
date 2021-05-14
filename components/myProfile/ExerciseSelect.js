export default function ExerciseSelect({ handleExerciseOptionChange, exerciseOptions }) {
  return (
    <select name="exerciseOptions" onChange={handleExerciseOptionChange} defaultValue="none">
      <option value="none" disabled>
        Select One
      </option>
      {exerciseOptions.map(({ exercise_id, exerciseName }) => (
        <option value={exercise_id} key={exercise_id}>
          {exerciseName}
        </option>
      ))}
    </select>
  );
}
