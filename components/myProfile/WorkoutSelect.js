export default function WorkoutSelect({ handleWorkoutOptionChange, workoutOptions }) {
  return (
    <select name="workoutOptions" onChange={handleWorkoutOptionChange} defaultValue="none">
      <option value="none">Select One</option>
      {workoutOptions.map((workout) => (
        <option value={workout._id} key={workout._id}>
          {workout.name}
        </option>
      ))}
    </select>
  );
}
