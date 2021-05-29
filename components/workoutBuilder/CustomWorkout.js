import styled from "styled-components";
// Components
import Checkmark from "../Checkmark";

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
      <header>
        <div className="input">
          <input
            type="text"
            name="workoutName"
            value={customWorkout.name}
            onChange={handleWorkoutNameChange}
            placeholder="New Workout"
          />

          {workoutSavedSuccessfuly && <Checkmark />}
        </div>

        {Boolean(customWorkout.exercises.length) && (
          <div className="controls">
            <button onClick={saveCustomWorkout}>Save</button>

            <button onClick={clearCustomWorkout}>Clear</button>

            {user?.isAdmin && (
              <div className="checkbox" onClick={handlePrivacyChange}>
                <label htmlFor="public">Public</label>
                <input
                  type="checkbox"
                  name="public"
                  checked={customWorkout.isPublic}
                  readOnly={true}
                />
              </div>
            )}
          </div>
        )}
      </header>

      {customWorkout.exercises.map(({ exercise, sets }, i) => (
        <li key={exercise._id} className="exercise">
          <p className="exTitle">
            <span>{i + 1}.</span> {exercise.name}
          </p>

          {sets.map(({ reps }, j) => (
            <div key={j}>
              <span>{j + 1}.</span>
              <input
                type="number"
                name="reps"
                value={reps}
                onChange={(e) => handleRepChange(e, i, j)}
              />
              <span>reps</span>
            </div>
          ))}

          <div className="setControl">
            <p>Set</p>
            <button onClick={() => handleSetChange("add", i)}>+</button>
            <button onClick={() => handleSetChange("remove", i)}>-</button>
          </div>

          <button className="removeBtn" onClick={() => removeExercise(exercise)}>
            Remove
          </button>
        </li>
      ))}
    </CustomWorkoutContainer>
  );
}

const CustomWorkoutContainer = styled.ul`
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    background: ${({ theme }) => theme.buttonLight};
    border-radius: 5px;
    width: 100%;
    .input {
      width: 100%;
      display: flex;
      align-items: center;

      input[type="text"] {
        flex: 1;
        max-width: calc(100% - 58px);
        margin: 0.5rem;
        padding: 0.5rem 0 0.5rem 0.5rem;
        font-size: 1.2rem;
        border: none;
        border-radius: 5px;
        color: ${({ theme }) => theme.text};
        background: ${({ theme }) => theme.buttonMed};
      }
    }

    .controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      button {
        border: none;
        border-radius: 5px;
        background: ${({ theme }) => theme.buttonMed};
        color: ${({ theme }) => theme.text};
        box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
        display: inline-block;
        margin: 0.5rem;
        padding: 0.5rem 1rem;
        font-size: 1.1rem;
      }

      .checkbox {
        border: none;
        border-radius: 5px;
        background: ${({ theme }) => theme.buttonMed};
        color: ${({ theme }) => theme.text};
        box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
        display: inline-block;
        margin: 0.5rem;
        padding: 0.5rem 1rem;
        font-size: 1.1rem;

        input[type="checkbox"] {
          margin: 0 0.5rem;
          transform: scale(1.5);
          border: none;
          box-shadow: 0 2px 4px ${({ theme }) => theme.boxShadow};
        }
      }
    }
  }

  .exercise {
    border-radius: 5px;
    box-shadow: 0 0 5px ${({ theme }) => theme.boxShadow};
    background: ${({ theme }) => theme.buttonLight};
    width: 100%;
    flex: 1;
    min-width: 150px;
    max-width: 160px;
    margin: 0.5rem;
    text-align: center;
    position: relative;

    display: flex;
    flex-direction: column;
    .exTitle {
      padding: 0.5rem;
      text-transform: capitalize;
    }
    div {
      margin: 0.2rem 0;
      flex: 1;

      input {
        width: 3rem;
        font-size: 1.25rem;
        padding: 0.25rem 0;
        margin: 0 0.25rem;
        background: ${({ theme }) => theme.buttonMed};
        color: inherit;
        text-align: center;
        border-radius: 3px;
        border: 1px solid ${({ theme }) => theme.border};
      }
      span {
        font-weight: 300;
        font-size: 0.7rem;
      }
    }
    .setControl {
      display: flex;
      justify-content: center;
      align-items: center;
      p {
        margin-right: 0.5rem;
      }
      button {
        cursor: pointer;
        border: 1px solid ${({ theme }) => theme.border};
        background: ${({ theme }) => theme.buttonMed};
        color: inherit;
        border-radius: 3px;
        margin: 0.15rem;
        height: 2rem;
        width: 2rem;
      }
    }
    .removeBtn {
      border: 1px solid ${({ theme }) => theme.buttonLight};
      background: ${({ theme }) => theme.buttonMed};
      color: ${({ theme }) => theme.textLight};
      padding: 0.5rem 0;
      cursor: pointer;
      border-radius: 0 0px 5px 5px;
    }
  }
`;
