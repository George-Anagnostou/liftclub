import { useState } from "react";
import styled from "styled-components";
import CreateExerciseModul from "./CreateExerciseModul";

const muscleGroups = [
  "all",
  "upper back",
  "lower back",
  "shoulder",
  "upper arm",
  "forearm",
  "chest",
  "hip",
  "upper leg",
  "lower leg",
  "core",
];

export default function ExerciseList({
  filterExercisesBy,
  displayedExercises,
  isExerciseInCustomWorkout,
  addExercise,
  removeExercise,
  user,
}) {
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);

  return (
    <ExercisesContainer>
      <div className="exercise-control">
        <h3>Exercises</h3>
        <div>
          <label htmlFor="muscleGroup">Muscle Group: </label>
          <select
            name="muscleGroup"
            id="muscleGroup"
            onChange={(e) => filterExercisesBy({ field: "muscleGroup", value: e.target.value })}
          >
            {muscleGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {user?.isAdmin && (
          <CreateExcerciseButton onClick={() => setShowCreateExerciseModal(true)}>
            Create Exercise
          </CreateExcerciseButton>
        )}
      </div>
      {showCreateExerciseModal && (
        <CreateExerciseModul
          muscleGroups={muscleGroups}
          setShowModul={setShowCreateExerciseModal}
        />
      )}

      {displayedExercises.map((each) => (
        <li
          key={each._id}
          className="exercise"
          style={isExerciseInCustomWorkout(each._id) ? { background: "#cccccc" } : {}}
        >
          <h3>{each.name}</h3>

          <p>
            <span>muscle group:</span> {each.muscleGroup}
          </p>

          <p>
            <span>muscle worked:</span> {each.muscleWorked}
          </p>

          <p>
            <span>equipment:</span> {each.equipment}
          </p>

          {isExerciseInCustomWorkout(each._id) ? (
            <button onClick={() => removeExercise(each)}>Remove</button>
          ) : (
            <button onClick={() => addExercise(each)}>Add</button>
          )}
        </li>
      ))}
    </ExercisesContainer>
  );
}

const ExercisesContainer = styled.ul`
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  width: 100%;
  margin: 0.5rem 0;
  overflow-x: hidden;
  position: relative;

  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;

  .exercise-control {
    position: sticky;
    top: 0;
    background: rgb(226, 226, 226);
    width: 100%;

    border-bottom: 1px solid black;
    text-align: center;
    div {
      flex: 1;
      padding: 0.5rem;
      display: inline-block;
    }
  }

  .exercise {
    border-radius: 5px;
    box-shadow: 0 0 5px grey;
    width: 100%;
    flex: 1;
    min-width: 140px;
    max-width: 160px;
    min-height: 200px;
    margin: 1rem;
    text-align: center;
    text-transform: capitalize;
    background: rgba(245, 145, 83, 0.185);

    display: flex;
    flex-direction: column;

    h3 {
      padding: 0.5rem 0;
    }

    p {
      flex: 1;
      display: block;
      width: 100%;
      border-bottom: 1px solid #d3d3d3;
      font-weight: 300;

      span {
        font-weight: 100;
        display: block;
        font-size: 0.6rem;
        width: 100%;
      }
    }

    button {
      padding: 0.5rem 0;
      cursor: pointer;
      background: inherit;
      border: none;
      border-radius: 0 0px 5px 5px;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CreateExcerciseButton = styled.button`
  padding: 0.5rem;
  margin: 0.5rem;
`;
