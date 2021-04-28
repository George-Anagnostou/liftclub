import { useState } from "react";
import styled from "styled-components";

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

const motions = [
  "all",
  "pulling",
  "pushing",
  "thrusting",
  "curling",
  "squatting",
  "rotating",
  "crunching",
  "breathing",
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

  const toggleExerciseModul = (e) => {
    if (showCreateExerciseModal) {
      // if modul is open, only close the modul when the shadow is clicked
      if (e.target.classList.contains("modul-shadow")) setShowCreateExerciseModal(false);
    } else {
      setShowCreateExerciseModal(true);
    }
  };

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

        <div>
          <label htmlFor="motion">Motion: </label>
          <select
            name="motion"
            id="motion"
            onChange={(e) => filterExercisesBy({ field: "motion", value: e.target.value })}
          >
            {motions.map((motion) => (
              <option key={motion} value={motion}>
                {motion}
              </option>
            ))}
          </select>
        </div>

        {user?.isAdmin && (
          <CreateExcerciseButton onClick={toggleExerciseModul}>
            Create Exercise
          </CreateExcerciseButton>
        )}
      </div>

      {displayedExercises.map((each) => (
        <li
          key={each._id}
          style={isExerciseInCustomWorkout(each._id) ? { background: "#c9c9c9" } : {}}
        >
          <h3>{each.name}</h3>
          <p>
            <span>motion:</span>
            {each.motion}
          </p>

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

      {showCreateExerciseModal && (
        <CreateExerciseModal onClick={toggleExerciseModul} className="modul-shadow">
          <div className="modul">
            <form action="POST">
              <h3>Create a New Exercise</h3>
              <div>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" />
              </div>
              <div>
                <label htmlFor="equipment">Equipment</label>
                <input type="text" name="equipment" />
              </div>
              <div>
                <label htmlFor="muscleGroup">Muscle Group</label>
                <input type="text" name="muscleGroup" />
              </div>
              <div>
                <label htmlFor="motion">Motion</label>
                <input type="text" name="motion" />
              </div>
              <div>
                <label htmlFor="muscleWorked">Muscle Worked</label>
                <input type="text" name="muscleWorked" />
              </div>
            </form>
          </div>
        </CreateExerciseModal>
      )}
    </ExercisesContainer>
  );
}

const ExercisesContainer = styled.ul`
  border: none;
  border-radius: 5px;
  box-shadow: 0 0 5px grey;
  width: 60%;
  max-height: 85vh;
  overflow-x: hidden;
  overflow-y: scroll;
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
      padding: 0.5rem 0;
      width: 50%;
      display: inline-block;
    }
  }

  li {
    border-radius: 5px;
    box-shadow: 0 0 5px grey;
    width: 100%;
    max-width: 150px;
    min-height: 250px;
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

const CreateExcerciseButton = styled.button``;

const CreateExerciseModal = styled.div`
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.2);

  position: fixed;
  top: 0;
  left: 0;

  display: grid;
  place-items: center;

  .modul {
    height: 70%;
    width: 95%;
    max-width: 500px;
    background: white;

    display: grid;
    place-items: center;

    form {
      height: 100%;
      display: flex;
      justify-content: space-around;
      flex-direction: column;
    }
  }
`;
