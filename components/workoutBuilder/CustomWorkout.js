import styled from "styled-components";

export default function CustomWorkout({
  customWorkout,
  workoutSavedSuccessfuly,
  clearCustomWorkout,
  handleWorkoutNameChange,
  handlePrivacyChange,
  handleRepChange,
  handleSetChange,
  removeExercise,
  saveCustomWorkout,
  user,
}) {
  return (
    <CustomWorkoutContainer>
      <div className="workout-control">
        <div className="workout-header">
          {workoutSavedSuccessfuly && <p style={{ color: "green" }}>Workout saved successfully</p>}
          {Boolean(customWorkout.exercises.length) && (
            <button onClick={saveCustomWorkout}>Save</button>
          )}
          <h3>Custom Workout</h3>
          {Boolean(customWorkout.exercises.length) && (
            <button onClick={clearCustomWorkout}>Clear</button>
          )}
        </div>

        <div className="workout-data">
          <label htmlFor="workoutName">Name: </label>
          <input
            type="text"
            name="workoutName"
            id="workoutName"
            value={customWorkout.name}
            onChange={handleWorkoutNameChange}
          />
          {user?.isAdmin && (
            <>
              <label htmlFor="public">Public</label>
              <input
                type="checkbox"
                name="public"
                id="public"
                checked={customWorkout.isPublic}
                onChange={handlePrivacyChange}
              />
            </>
          )}
        </div>
      </div>

      {customWorkout.exercises.map(({ exercise, sets }, i) => (
        <li key={exercise._id} className="exercise">
          <p>
            <span>{i + 1}.</span> {exercise.name}
          </p>

          {sets.map(({ reps }, j) => (
            <div key={j}>
              <span>set {j + 1}.</span>
              <input
                type="number"
                name="reps"
                id="reps"
                value={reps}
                onChange={(e) => handleRepChange(e, i, j)}
              />{" "}
              <span>reps</span>
            </div>
          ))}

          <div>
            <button onClick={() => handleSetChange("add", i)}>Add set</button>
            <button onClick={() => handleSetChange("remove", i)}>Remove set</button>
          </div>

          <button onClick={() => removeExercise(exercise)}>Remove</button>
        </li>
      ))}
    </CustomWorkoutContainer>
  );
}

const CustomWorkoutContainer = styled.ul`
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  width: 85%;
  margin: 0.5rem 0;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;

  .workout-control {
    text-align: center;
    width: 100%;
    margin: 0.5rem 0;
    .workout-header {
      margin-bottom: 1rem;
      button {
        border: none;
        box-shadow: 0 0 2px grey;
        display: inline-block;
        margin: 0 0.5rem;
        padding: 0.75rem;
      }
      h3 {
        display: inline-block;
      }
    }
    .workout-data {
      display: flex;
      justify-content: center;
      align-items: center;
      label {
        font-size: 0.8rem;
      }
      input[type="text"] {
        width: 50%;
        margin: 0.5rem;
        font-size: 1.2rem;
      }
      input[type="checkbox"] {
        margin: 0.5rem;
        transform: scale(1.7);
        border: none;
      }
    }
  }

  .exercise {
    border-radius: 5px;
    box-shadow: 0 0 5px grey;
    background: rgba(168, 182, 255, 0.24);
    width: 100%;
    flex: 1;
    min-width: 150px;
    max-width: 160px;
    margin: 0.5rem;
    text-align: center;
    text-transform: capitalize;

    display: flex;
    flex-direction: column;
    div {
      margin: 0.2rem 0;
      flex: 1;

      input {
        width: 3rem;
      }
      span {
        font-weight: 300;
        font-size: 0.7rem;
      }
      button {
        cursor: pointer;
        border: 1px solid #acacac;
        border-radius: 3px;
        margin: 0.15rem;
        padding: 0.25rem;
      }
    }
    button {
      border: 1px solid #acacac;
      padding: 0.5rem 0;
      cursor: pointer;
      background: inherit;
      border-radius: 0 0px 5px 5px;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
