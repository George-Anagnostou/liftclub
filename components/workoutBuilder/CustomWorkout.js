import { useEffect } from "react";
import styled from "styled-components";
//Utils
import { postNewWorkout, updateExistingWorkout } from "../../utils/api";
// Components
import Checkmark from "../Checkmark";

export default function CustomWorkout({
  customWorkout,
  setCustomWorkout,
  workoutSavedSuccessfuly,
  setWorkoutSavedSuccessfuly,
  clearCustomWorkout,
  removeExercise,
  user,
}) {
  // Handles changes for customWorkoutName
  const handleWorkoutNameChange = (e) => {
    setCustomWorkout((prev) => {
      return { ...prev, name: e.target.value };
    });
  };

  const handlePrivacyChange = () => {
    setCustomWorkout((prev) => {
      return { ...prev, isPublic: !prev.isPublic };
    });
  };

  // Update the reps for specified set
  const handleRepChange = (e, exerciseIndex, setIndex) => {
    const num = e.target.value === "" ? "" : Number(e.target.value);

    const { exercises } = customWorkout;

    exercises[exerciseIndex].sets[setIndex].reps = num;

    setCustomWorkout((prev) => {
      return { ...prev, exercises: exercises };
    });
  };

  const handleSetChange = (method, exerciseIndex) => {
    const { exercises } = customWorkout;

    switch (method) {
      case "add":
        // Add empty set to spedified exercise
        exercises[exerciseIndex].sets.push({ reps: 0, weight: -1 });
        break;
      case "remove":
        // Remove last set from spedified exercise
        exercises[exerciseIndex].sets.pop();
        break;
    }

    setCustomWorkout((prev) => {
      return { ...prev, exercises: exercises };
    });
  };

  const saveCustomWorkout = async () => {
    const { exercises } = customWorkout;
    // Only take exercise_id and sets (exercise data not needed for DB)
    const composedExercises = exercises.map(({ exercise_id, sets }) => {
      return { exercise_id, sets };
    });

    const composedWorkout = {
      ...customWorkout,
      exercises: composedExercises,
    };

    if (composedWorkout.creator_id === user._id) {
      // Workout owner is editing existing workout

      const saveStatus = await updateExistingWorkout(composedWorkout);
      setWorkoutSavedSuccessfuly(saveStatus);
    } else {
      // User is saving their version of a saved workout or building a new workout

      composedWorkout.name = "New Workout";
      // Current user set to creator
      composedWorkout.creator_id = user._id;
      // Only allow admins to save public workouts
      if (!user.isAdmin) composedWorkout.isPublic = false;
      // Remove any existing _id
      delete composedWorkout._id;
      // Add date created
      composedWorkout.date_created = new Date().toISOString();

      const saveStatus = await postNewWorkout(composedWorkout);
      setWorkoutSavedSuccessfuly(saveStatus);
    }

    clearCustomWorkout();
  };

  // Remove saved successfully notification after 5 seconds
  useEffect(() => {
    if (workoutSavedSuccessfuly) {
      setTimeout(() => {
        setWorkoutSavedSuccessfuly(null);
      }, 5000);
    }
  }, [workoutSavedSuccessfuly]);

  return (
    <CustomWorkoutContainer>
      <header>
        <div className="wrapper">
          <input
            type="text"
            name="workoutName"
            value={customWorkout.name}
            onChange={handleWorkoutNameChange}
            placeholder="New Workout"
          />

          {workoutSavedSuccessfuly && (
            <Checkmark position={{ position: "absolute", right: "1.4rem" }} />
          )}
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
        <Exercise key={exercise._id}>
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
        </Exercise>
      ))}

      {!Boolean(customWorkout.exercises.length) && (
        <FallbackText>
          <p>
            Add an exercise below to <br />
            begin creating a workout.
          </p>
        </FallbackText>
      )}
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
    padding: 0.5rem;

    .wrapper {
      border-radius: 5px;
      width: 100%;
      background: ${({ theme }) => theme.buttonMed};

      display: flex;
      align-items: center;

      input[type="text"] {
        width: 100%;
        padding: 0.5rem;
        font-size: 4.4vw;
        border: none;
        border-radius: 5px;
        color: ${({ theme }) => theme.text};
        background: inherit;
      }
    }

    .controls {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
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
`;

const Exercise = styled.li`
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
`;

const FallbackText = styled.div`
  background: ${({ theme }) => theme.buttonMed};
  color: ${({ theme }) => theme.textLight};

  width: 100%;
  border-radius: 5px;
  margin: 1rem;
  padding: 1rem;
`;
