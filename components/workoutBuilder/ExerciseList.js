import { useState, useEffect } from "react";
import styled from "styled-components";
import useSWR from "swr";
// Components
import CreateExerciseModal from "./CreateExerciseModal";
// Context
import { useStoreState } from "../../store";

// SWR fetcher
const fetcher = (url) => fetch(url).then((r) => r.json());

export default function ExerciseList({ isExerciseInCustomWorkout, addExercise, removeExercise }) {
  const { data, error } = useSWR("/api/exercises", fetcher);

  const { user } = useStoreState();

  const [searchTerm, setSearchTerm] = useState("");
  const [displayedExercises, setDisplayedExercises] = useState([]);
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);

  const handleSearchTermChange = (e) => setSearchTerm(e.target.value);

  const filterExercisesBy = (term) => {
    if (term) {
      const filtered = data.filter((exercise) => {
        const { _id, ...no_id } = exercise;
        return Object.values(no_id).some((val) => val.toLowerCase().includes(term.toLowerCase()));
      });

      console.log(term, filtered);

      setDisplayedExercises(filtered);
    } else {
      const alphabetical = data.sort((a, b) => {
        if (a.name.toLowerCase().charAt(0) < b.name.toLowerCase().charAt(0)) return -1;
        if (a.name.toLowerCase().charAt(0) > b.name.toLowerCase().charAt(0)) return 1;
        return 0;
      });

      setDisplayedExercises(alphabetical);
    }
  };

  useEffect(() => {
    if (data) filterExercisesBy(searchTerm);
  }, [searchTerm, data]);

  // Error catch for SWR
  if (error) return <h1>failed to load</h1>;

  return (
    <ExercisesContainer>
      <header>
        <input
          type="text"
          name="searchTerm"
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder="Search"
        />

        {user?.isAdmin && <button onClick={() => setShowCreateExerciseModal(true)}>Add</button>}
      </header>

      {showCreateExerciseModal && <CreateExerciseModal setShowModal={setShowCreateExerciseModal} />}

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

    input {
      font-size: 1.2rem;
      flex: 4;
      margin: 0.5rem;
      padding: 0.5rem;
      border: none;
      border-radius: 5px;
      color: ${({ theme }) => theme.text};
      background: ${({ theme }) => theme.buttonMed};
    }

    button {
      font-size: 1.2rem;
      flex: 1;
      background: ${({ theme }) => theme.buttonMed};
      color: inherit;
      border: none;
      margin: 0.5rem 0.5rem 0.5rem 0;
      border-radius: 5px;
      padding: 0.5rem;
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
