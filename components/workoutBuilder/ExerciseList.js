import { useState, useEffect } from "react";
import styled from "styled-components";
import useSWR from "swr";
// Components
import CreateExerciseModal from "./CreateExerciseModal";
// Context
import { useStoreState } from "../../store";

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
// SWR fetcher
const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ExerciseList({ isExerciseInCustomWorkout, addExercise, removeExercise }) {
  const { data, error } = useSWR("/api/exercises", fetcher);

  const { user } = useStoreState();

  const [displayedExercises, setDisplayedExercises] = useState([]);
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);

  const filterExercisesBy = async ({ field, value }) => {
    try {
      let res;
      // Don't use "field" and "value" for searching by "all"
      value === "all"
        ? (res = await fetch(`/api/exercises`))
        : (res = await fetch(`/api/exercises?${field}=${value}`));

      const queried = await res.json();
      setDisplayedExercises(queried);
    } catch (e) {
      console.log(e);
    }
  };

  // Set exercises once SWR fetches the exercise data
  useEffect(() => {
    if (data) setDisplayedExercises(data);
  }, [data]);
  // Used with SWR
  if (error) return <h1>failed to load</h1>;

  return (
    <ExercisesContainer>
      <header>
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

        {user?.isAdmin && <button onClick={() => setShowCreateExerciseModal(true)}>Add New</button>}
      </header>

      {showCreateExerciseModal && (
        <CreateExerciseModal
          muscleGroups={muscleGroups}
          setShowModal={setShowCreateExerciseModal}
        />
      )}

      {data && (
        <>
          {displayedExercises.map((each) => (
            <li
              key={each._id}
              className={`exercise ${isExerciseInCustomWorkout(each._id) ? "highlight" : ""}`}
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
        </>
      )}
    </ExercisesContainer>
  );
}

const ExercisesContainer = styled.ul`
  border: none;
  width: 100%;
  margin: 0.5rem 0;
  overflow-x: hidden;
  position: relative;

  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;

  header {
    background: ${({ theme }) => theme.buttonLight};
    width: 100%;
    border-radius: 5px;

    display: flex;
    align-items: center;
    justify-content: center;

    div {
      flex: 1;
      label {
      }

      select {
        margin: 0.5rem 0;
        padding: 0.5rem;
        font-size: 1rem;
        border: none;
        border-radius: 5px;
        color: ${({ theme }) => theme.text};
        background: ${({ theme }) => theme.buttonMed};
      }
    }

    button {
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 2px 5px ${({ theme }) => theme.boxShadow};
      color: inherit;
      border: none;
      border-radius: 3px;
      margin: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }
  }

  .exercise {
    border-radius: 5px;
    box-shadow: 0 0 5px ${({ theme }) => theme.boxShadow};
    background: ${({ theme }) => theme.buttonLight};
    width: 100%;
    flex: 1;
    min-width: 140px;
    max-width: 160px;
    min-height: 200px;
    margin: 1rem;
    text-align: center;
    text-transform: capitalize;

    display: flex;
    flex-direction: column;

    h3 {
      padding: 0.5rem;
      word-wrap: break-word;
    }

    p {
      flex: 1;
      display: block;
      width: 100%;
      font-weight: 300;
      margin-bottom: 0.75rem;
      color: ${({ theme }) => theme.textLight};

      span {
        margin: 0.25rem 0;
        font-weight: 100;
        display: block;
        font-size: 0.6rem;
        width: 100%;
      }
    }

    button {
      border: 1px solid ${({ theme }) => theme.buttonLight};
      background: ${({ theme }) => theme.buttonMed};
      color: ${({ theme }) => theme.textLight};
      padding: 0.5rem 0;
      cursor: pointer;
      border-radius: 0 0px 5px 5px;
    }

    &.highlight {
      background: ${({ theme }) => theme.body};
      color: ${({ theme }) => theme.textLight};
    }
  }
`;
