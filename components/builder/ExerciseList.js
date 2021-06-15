import { useState, useEffect } from "react";
import styled from "styled-components";
import useSWR from "swr";
// Context
import { useStoreState } from "../../store";
// Components
import LoadingSpinner from "../LoadingSpinner";
import CreateExerciseModal from "./CreateExerciseModal";
import ExerciseListItem from "./ExerciseListItem";

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

        <button onClick={() => setSearchTerm("")}>Clear</button>

        {user?.isAdmin && <button onClick={() => setShowCreateExerciseModal(true)}>Add</button>}
      </header>

      {showCreateExerciseModal && <CreateExerciseModal setShowModal={setShowCreateExerciseModal} />}

      {data ? (
        <ul>
          {displayedExercises.map((exercise) => (
            <ExerciseListItem
              key={exercise._id}
              exercise={exercise}
              isExerciseInCustomWorkout={isExerciseInCustomWorkout}
              removeExercise={removeExercise}
              addExercise={addExercise}
            />
          ))}
        </ul>
      ) : (
        <LoadingSpinner />
      )}
    </ExercisesContainer>
  );
}

const ExercisesContainer = styled.div`
  border: none;
  width: 100%;

  header {
    position: sticky;
    top: 0.5rem;
    z-index: 99;

    background: ${({ theme }) => theme.buttonMed};
    width: 100%;
    margin-bottom: 0.5rem;
    border-radius: 5px;

    display: flex;
    align-items: center;
    justify-content: center;

    input {
      font-size: 1rem;
      flex: 1;
      margin: 0.5rem;
      padding: 0.5rem;
      border: none;
      border-radius: 5px;
      color: ${({ theme }) => theme.text};
      background: ${({ theme }) => theme.background};
    }

    button {
      font-size: 1rem;
      background: ${({ theme }) => theme.background};
      color: inherit;
      border: none;
      margin: 0.5rem 0.5rem 0.5rem 0;
      border-radius: 5px;
      padding: 0.5rem;
    }
  }

  ul {
    width: 100%;

    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
  }
`;
