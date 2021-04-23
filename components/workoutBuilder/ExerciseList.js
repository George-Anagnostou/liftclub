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
}) {
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
          <button onClick={() => addExercise(each)}>Add</button>
        </li>
      ))}
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
        text-transform: uppercase;
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