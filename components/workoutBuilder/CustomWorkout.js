import styled from "styled-components";

export default function CustomWorkout({
  workoutSavedSuccessfuly,
  customWorkoutExercises,
  clearCustomWorkout,
  customWorkoutName,
  handleWorkoutNameChange,
  customWorkoutPublic,
  handlePrivacyChange,
  handleRepChange,
  changeSetLength,
  removeExercise,
  saveWorkoutToDB,
  user,
}) {
  return (
    <CustomWorkoutContainer>
      <div className="workout-control">
        <div className="workout-header">
          {workoutSavedSuccessfuly && <p style={{ color: "green" }}>Workout saved successfully</p>}
          {Boolean(customWorkoutExercises.length) && (
            <button onClick={saveWorkoutToDB}>Save</button>
          )}
          <h3>Custom Workout</h3>
          {Boolean(customWorkoutExercises.length) && (
            <button onClick={clearCustomWorkout}>Clear</button>
          )}
        </div>
        <div className="workout-data">
          <label htmlFor="workoutName">Name: </label>
          <input
            type="text"
            name="workoutName"
            id="workoutName"
            value={customWorkoutName}
            onChange={handleWorkoutNameChange}
          />
          {user?.isAdmin && (
            <>
              <label htmlFor="public">Public</label>
              <input
                type="checkbox"
                name="public"
                id="public"
                checked={customWorkoutPublic}
                onChange={handlePrivacyChange}
              />
            </>
          )}
        </div>
      </div>

      {customWorkoutExercises.map(({ exercise, sets }, i) => (
        <li key={exercise._id}>
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
                onChange={(e) => handleRepChange(e, exercise._id, j)}
              />{" "}
              <span>reps</span>
            </div>
          ))}

          <div>
            <button onClick={() => changeSetLength("add", i)}>Add set</button>
            <button onClick={() => changeSetLength("remove", i)}>Remove set</button>
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
  width: 25%;

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

  li {
    border-radius: 5px;
    box-shadow: 0 0 5px grey;
    background: rgb(215, 221, 247);
    width: 100%;
    max-width: 150px;
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
        border: none;
        border-radius: 3px;
        margin: 0.15rem;
      }
    }
    button {
      padding: 0.2rem;
      margin-top: 0.5rem;
      cursor: pointer;
      border: none;
      border-radius: 0 0 5px 5px;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
